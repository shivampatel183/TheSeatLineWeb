import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-google-login',
  standalone: true,
  templateUrl: './google-login.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GoogleLoginComponent implements OnInit {
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id:
        '966081852486-j62f41l7i8t1mfe2ef06ohunk8mid1vv.apps.googleusercontent.com',
      callback: this.handleCredentialResponse,
    });

    google.accounts.id.renderButton(document.getElementById('googleBtn'), {
      theme: 'outline',
      size: 'large',
    });
  }

  handleCredentialResponse(response: any) {
    console.log('Google Token:', response.credential);
  }
}
