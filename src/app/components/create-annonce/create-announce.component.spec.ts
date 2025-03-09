import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnnounceComponent } from './create-announce.component';

describe('CreateAnnonceComponent', () => {
  let component: CreateAnnounceComponent;
  let fixture: ComponentFixture<CreateAnnounceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAnnounceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAnnounceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
