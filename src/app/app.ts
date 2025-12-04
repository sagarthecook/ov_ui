import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
   standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'ov_ui';
}
