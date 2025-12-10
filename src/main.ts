import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { enableProfiling } from '@angular/core';
enableProfiling();
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
