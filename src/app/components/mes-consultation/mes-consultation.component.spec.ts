import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesConsultationComponent } from './mes-consultation.component';

describe('MesConsultationComponent', () => {
  let component: MesConsultationComponent;
  let fixture: ComponentFixture<MesConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesConsultationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MesConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
