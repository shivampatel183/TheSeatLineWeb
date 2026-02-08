import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './common/components/toast/toast.component';
import { NavbarComponent } from './Component/navbar/navbar.component';
import { FooterComponent } from './Component/footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TheSeatLineWeb';

  ngOnInit() {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem('city', data.city);
      });
  }
}
