import { Component, OnInit, Inject, DOCUMENT } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

declare const emailjs: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private toastController: ToastController
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      empresa: [''],
      servicio: [''],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.setupScrollAnimations();
    this.initializeEmailJS();
  }

  private setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    setTimeout(() => {
      const fadeElements = this.document.querySelectorAll('.fade-in');
      fadeElements.forEach(el => observer.observe(el));
    }, 100);
  }

  private initializeEmailJS() {
    // Load EmailJS SDK if not already loaded
    if (typeof emailjs === 'undefined') {
      const script = this.document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.onload = () => {
        (window as any).emailjs.init({
          publicKey: "TU_PUBLIC_KEY" // Replace with your actual public key
        });
      };
      this.document.head.appendChild(script);
    } else {
      emailjs.init({
        publicKey: "TU_PUBLIC_KEY" // Replace with your actual public key
      });
    }
  }

  async onSubmit() {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched();
      await this.showToastMessage('Por favor complete todos los campos obligatorios correctamente.', 'danger');
      return;
    }

    this.isSubmitting = true;
    const formData = this.contactForm.value;

    // Prepare template parameters for EmailJS
    const templateParams = {
      from_name: formData.nombre,
      from_email: formData.email,
      from_telefono: formData.telefono || 'No proporcionado',
      from_empresa: formData.empresa || 'No proporcionada',
      servicio_interes: formData.servicio || 'No especificado',
      message: formData.mensaje,
      to_email: 'ricardoandresbonilla@gmail.com', // Replace with your destination email
      reply_to: formData.email
    };

    try {
      // Send email using EmailJS
      await emailjs.send(
        'TU_SERVICE_ID',    // Replace with your Service ID
        'TU_TEMPLATE_ID',   // Replace with your Template ID
        templateParams
      );

      await this.showToastMessage('¡Solicitud enviada exitosamente! Nos contactaremos con usted en las próximas 24 horas.', 'success');
      this.contactForm.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      await this.showToastMessage('Hubo un error al enviar la solicitud. Por favor intente nuevamente.', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  private async showToastMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 5000,
      position: 'top',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
