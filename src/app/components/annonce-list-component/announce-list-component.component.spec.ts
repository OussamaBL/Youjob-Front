import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceListComponentComponent } from './announce-list-component.component';

describe('AnnonceListComponentComponent', () => {
  let component: AnnounceListComponentComponent;
  let fixture: ComponentFixture<AnnounceListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnounceListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnounceListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
