
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FileUploadResponse {
  fileKey: string;
  fileUrl: string;
  fileName: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:8080/api/files';

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('contentType', file.type);

    return this.http.post<FileUploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  deleteFile(fileKey: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fileKey}`);
  }

  testConnection(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/test`);
  }

  getFileUrl(fileKey: string): string {
    return `http://localhost:9001/gabinetes/${fileKey}`;
  }
}