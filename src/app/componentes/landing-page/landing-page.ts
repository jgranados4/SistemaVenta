import { Component, signal } from '@angular/core';
import {RouterLink} from '@angular/router'
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  avatar: string;
  quote: string;
}

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export default class LandingPage {
  features = signal<Feature[]>([
    {
      icon: 'point_of_sale', // Ícono de material icons
      title: 'VENTAS INTELIGENTES',
      description:
        'Moderniza un punto de venta con facilidad. Gestiona ventas y reportes desde cualquier lugar.',
    },
    {
      icon: 'inventory_2',
      title: 'INVENTARIO AUTOMÁTICO',
      description:
        'Olvídate del control manual. Automatiza con nuestro sistema de inventario detallado.',
    },
    {
      icon: 'bar_chart',
      title: 'REPORTES DETALLADOS',
      description:
        'Toma decisiones informadas con análisis detallados de tus ventas, inventarios y clientes.',
    },
    {
      icon: 'groups', // Ícono para los testimonios (para reutilizar estructura de tarjeta)
      title: 'REPORTES DETALLADOS',
      description:
        'Moderniza un ventas y reportes detallados para que siempre estés al control.',
    },
  ]);

  testimonials = signal<Testimonial[]>([
    {
      name: 'María García',
      avatar: 'assets/images/avatar1.jpg', // Reemplaza con tus imágenes
      quote:
        '"VentaPro nos ayudó a escalar nuestro negocio rápido. ¡Gracias a ellos nos sentimos muy seguros!"',
    },
    {
      name: 'Juan Pérez',
      avatar: 'assets/images/avatar2.jpg',
      quote:
        '"Automatizamos nuestro inventario y ventas en una semana. ¡La plataforma es increíblemente intuitiva!"',
    },
    {
      name: 'Carlos Rodríguez',
      avatar: 'assets/images/avatar3.jpg',
      quote:
        '"Tener reportes detallados nos ayudó a identificar qué productos nos daban más ganancia. ¡Excelente servicio!"',
    },
  ]);
}
