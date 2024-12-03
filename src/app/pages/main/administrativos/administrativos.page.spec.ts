import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrativosPage } from './administrativos.page';

describe('AdministrativosPage', () => {
  let component: AdministrativosPage;
  let fixture: ComponentFixture<AdministrativosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrativosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
