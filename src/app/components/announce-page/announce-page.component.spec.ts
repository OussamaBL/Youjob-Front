import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncePageComponent } from './announce-page.component';

describe('AnnouncePageComponent', () => {
  let component: AnnouncePageComponent;
  let fixture: ComponentFixture<AnnouncePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnouncePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
