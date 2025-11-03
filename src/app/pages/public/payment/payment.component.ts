import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-payment",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./payment.component.html",
  styleUrl: "./payment.component.css",
})
export class PaymentComponent {
  metodoPagamento = "cartao"

  dadosCartao = {
    titular: "",
    numero: "",
    mes: "",
    ano: "",
    cvv: "",
  }

  dadosPIX = {
    chave: "",
  }

  dadosBoleto = {
    confirmado: false,
  }

  processando = false
  pagamentoRealizado = false

  processarPagamento(): void {
    if (this.validarPagamento()) {
      this.processando = true

      setTimeout(() => {
        this.processando = false
        this.pagamentoRealizado = true
        console.log("Pagamento processado")
      }, 2000)
    }
  }

  validarPagamento(): boolean {
    if (this.metodoPagamento === "cartao") {
      return (
        this.dadosCartao.titular !== "" &&
        this.dadosCartao.numero !== "" &&
        this.dadosCartao.mes !== "" &&
        this.dadosCartao.ano !== "" &&
        this.dadosCartao.cvv !== ""
      )
    } else if (this.metodoPagamento === "pix") {
      return this.dadosPIX.chave !== ""
    } else if (this.metodoPagamento === "boleto") {
      return this.dadosBoleto.confirmado
    }
    return false
  }

  copiarChavePIX(): void {
    const chave =
      "00020126580014br.gov.bcb.pix0136xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx52040000530398654061234.565802BR5913TESTE LTDA6009SAO PAULO62410503***63041D3D"
    navigator.clipboard.writeText(chave)
    alert("Chave PIX copiada para a área de transferência!")
  }
}
