import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { NgForm } from '@angular/forms';
import type{ Contact } from './models/contact';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('contact-list');
  protected appName:string = 'دفترچه تلفن';
  protected toggleFavorite(contact: Contact): void {
  contact.isFavorite = !contact.isFavorite;
  }
  protected contacts: Contact[] = [
    {
      id: 1,
      name: 'سارا محمدی',
      phone: '09121234567',
      email: 'sara@example.com',
      category: 'همکار',
      isFavorite: true,
      address: 'تهران'
    },
    {
      id: 2,
      name: 'محمد رضایی',
      phone: '09123456789',
      email: 'mohammad@example.com',
      category: 'دوستان',
      isFavorite: false,
      address: 'کرج'
    }
  ];
  protected editingContact : Contact | null = null;
  protected isAddingContact : boolean = false;
  protected startAdd(): void{
    this.isAddingContact = true;

    this.editingContact = {
      id : 0,
      name: '',
      phone: '',
      email: '',
      category: '',
      isFavorite: false,
      address: ''
    };
  }
  protected searchText: string = '';
  protected get filteredContacts(): Contact[] {
    const query = this.searchText.trim().toLocaleLowerCase();

    if(!query){
      return this.contacts;
    }
    return this.contacts.filter((contact) => 
      contact.name
        .toLocaleLowerCase()
        .split(/\s+/)
        .some((part) => part.startsWith(query)) || 
      contact.phone.includes(query) ||
      contact.email.toLocaleLowerCase().includes(query)
    );
  }
  protected startEdit( contact: Contact): void{
    this.isAddingContact = false;
    this.editingContact = { ...contact };
  }
  protected saveEdit(form: NgForm): void {
  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }
  const formContact = this.editingContact;

  if (formContact === null) {
    return;
  }

  if (this.isAddingContact) {
    const nextId =
      Math.max(0, ...this.contacts.map((contact) => contact.id)) + 1;

    this.contacts = [
      ...this.contacts,
      { ...formContact, id: nextId }
    ];
  } else {
    this.contacts = this.contacts.map((contact) =>
      contact.id === formContact.id ? formContact : contact
    );
  }

  this.editingContact = null;
  this.isAddingContact = false;
}

protected cancelEdit(): void {
  this.isAddingContact = false;
  this.editingContact = null;
}

  protected contactToDelete: Contact | null = null;

  protected deleteContact(contact: Contact): void {
    this.contactToDelete = contact;
  }

  protected cancelDelete(): void {
    this.contactToDelete = null;
  }

  protected confirmDelete(): void {
    const contact = this.contactToDelete;

    if (contact === null) {
      return;
    }

    this.contacts = this.contacts.filter(
      (person) => person.id !== contact.id
    );
    this.contactToDelete = null;
  }

 
}

