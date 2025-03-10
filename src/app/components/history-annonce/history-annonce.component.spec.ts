import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAnnonceComponent } from './history-annonce.component';

describe('HistoryAnnonceComponent', () => {
  let component: HistoryAnnonceComponent;
  let fixture: ComponentFixture<HistoryAnnonceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryAnnonceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
