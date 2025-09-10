import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'card-overview-example',
  standalone: true,             // ⚠️ Essencial
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './card-overview-example.component.html',
  styleUrls: ['./card-overview-example.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardOverviewExample {}
