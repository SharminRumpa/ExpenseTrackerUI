import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
import { CategorySummary } from '../../shared/models/report.model';

const PALETTE = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#0891b2', '#7c3aed', '#db2777', '#65a30d'];

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class Reports implements OnInit {
  private authService = inject(AuthService);
  private reportService = inject(ReportService);

  summary = signal<CategorySummary | null>(null);
  isLoading = signal(true);

  fromDate = this.firstOfMonth();
  toDate = this.today();

  pieGradient = computed(() => {
    const categories = this.summary()?.categories ?? [];
    if (!categories.length) return 'conic-gradient(#e5e7eb 0deg 360deg)';

    let cumulative = 0;
    const stops = categories.map((cat, i) => {
      const start = cumulative * 3.6;
      cumulative += cat.percentage;
      const end = cumulative * 3.6;
      return `${PALETTE[i % PALETTE.length]} ${start}deg ${end}deg`;
    });

    return `conic-gradient(${stops.join(', ')})`;
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.isLoading.set(true);
    this.reportService.getCategorySummary({ userId, fromDate: this.fromDate, toDate: this.toDate })
      .subscribe(summary => {
        this.summary.set(summary);
        this.isLoading.set(false);
      });
  }

  colorFor(index: number): string {
    return PALETTE[index % PALETTE.length];
  }

  private firstOfMonth(): string {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().substring(0, 10);
  }

  private today(): string {
    return new Date().toISOString().substring(0, 10);
  }
}