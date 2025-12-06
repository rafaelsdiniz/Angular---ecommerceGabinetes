
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface MinioFileInfo {
  fileKey: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadDate: Date;
}

export interface MinioBucketInfo {
  name: string;
  creationDate: Date;
  objectCount: number;
}

export interface FileUploadResponse {
  fileKey: string;
  fileUrl: string;
  fileName: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MinioHelperService {
  private apiUrl = 'http://localhost:8080/api/files';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    
    if (token && token.length > 2000) {
      console.warn('Token muito grande, usando headers sem autenticação');
      return new HttpHeaders();
    }
    
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  testConnection(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/test`, {
      headers: this.getAuthHeaders()
    });
  }

  uploadFile(file: File): Observable<FileUploadResponse> {
    console.log('📤 Enviando arquivo para MinIO:', file.name, file.size + ' bytes');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('contentType', file.type);

    return this.http.post<FileUploadResponse>(`${this.apiUrl}/upload`, formData, {
        headers: this.getAuthHeaders()
    }).pipe(
        catchError((error) => {
            console.error('❌ Erro no upload:', error);
            if (error.status === 0) {
                throw new Error('Servidor indisponível. Verifique se o backend está rodando.');
            }
            throw error;
        })
    );
}

  deleteFile(fileKey: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${fileKey}`, {
      headers: this.getAuthHeaders()
    });
  }

  getFileUrl(fileKey: string): string {
    return `http://localhost:9001/gabinetes/${fileKey}`;
  }

  getSignedUrl(fileKey: string, expiresInMinutes: number = 60): Observable<{ signedUrl: string }> {
    return this.http.get<{ signedUrl: string }>(
      `${this.apiUrl}/signed-url/${fileKey}?expiresIn=${expiresInMinutes}`,
      { headers: this.getAuthHeaders() }
    );
  }

  validateImageFile(file: File): { isValid: boolean; error?: string } {

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Tipo de arquivo não suportado. Use JPEG, PNG, GIF ou WebP.' 
      };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: 'Arquivo muito grande. Tamanho máximo: 5MB.' 
      };
    }

    return { isValid: true };
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  optimizeImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context não disponível'));
        return;
      }

      img.onload = () => {
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Falha ao otimizar imagem'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }

  async uploadOptimizedImage(
    file: File, 
    maxWidth: number = 1200, 
    quality: number = 0.8
  ): Promise<FileUploadResponse> {
    try {

      const optimizedBlob = await this.optimizeImage(file, maxWidth, quality);
      

      const optimizedFile = new File(
        [optimizedBlob], 
        file.name, 
        { type: file.type }
      );


      return await this.uploadFile(optimizedFile).toPromise() as FileUploadResponse;

    } catch (error) {
      console.error('Erro ao otimizar imagem, tentando upload original:', error);
      
      return await this.uploadFile(file).toPromise() as FileUploadResponse;
    }
  }

  checkFileAccessibility(fileUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = fileUrl;
      

      setTimeout(() => resolve(false), 5000);
    });
  }


  getBucketInfo(): Observable<MinioBucketInfo> {
    return this.http.get<MinioBucketInfo>(`${this.apiUrl}/bucket-info`, {
      headers: this.getAuthHeaders()
    });
  }

  listFiles(): Observable<MinioFileInfo[]> {
    return this.http.get<MinioFileInfo[]>(`${this.apiUrl}/list`, {
      headers: this.getAuthHeaders()
    });
  }

  generateUniqueFileName(originalFileName: string): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalFileName.split('.').pop() || 'jpg';
    return `${timestamp}-${randomString}.${extension}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isMinioOnline(): Promise<boolean> {
    return new Promise((resolve) => {
      this.testConnection().subscribe({
        next: () => resolve(true),
        error: () => resolve(false)
      });
    });
  }

  isAuthenticated(): boolean {
    return this.authService.estaLogado(); 
  }

  getCurrentUser() {

    let usuario: any = null;
    this.authService.getCliente().subscribe(cliente => {
      usuario = cliente;
    });
    return usuario;
  }

  logout(): void {
    this.authService.limparTudo();
  }

  isAdmin(): boolean {
    const usuario = this.getCurrentUser();
    return usuario?.perfil === 'ADMIN';
  }

  canUpload(): boolean {
    return this.isAuthenticated() && this.isAdmin();
  }
}