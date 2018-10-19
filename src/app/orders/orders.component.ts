import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlexModalService } from '../shared-components/flex-modal/flex-modal.service';
import { Http } from '@angular/http';

export interface IOrder {
  pid?: string;
  image?: string;
  description?: string;
  price?: number;
  quantity?: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  orders: Array<any> = [];
  errorMessage: string = '';
  confirmMessage: string = '';
  name: string = '';
  constructor(
    private router: Router,
    private flexModal: FlexModalService,
    private http: Http
  ) {

  }

  async ngOnInit() {

  }

  // prepare result, splice last name, first name
  validate(name: string, total: number, taxAmount: number, subTotal: number) {
    this.errorMessage = '';
    if (!total) {
      this.errorMessage = 'Must execute calculation!';
    }
    if (name == '') {
      this.errorMessage = 'Name must not be empty!';

    } else if (name.indexOf(', ') == -1) {
      this.errorMessage = 'Name must have a comma and space!';
    }
    if (this.errorMessage.length > 0) {
      return false;
    } else {
      return true;
    }


  }

  showMessage(modalID: string) {
    this.flexModal.openDialog(modalID);
  }
  // Calculate total and perform input validation
  calculateTotal() {
    const total = this.orders.reduce((acc: number, item: IOrder) => {
      acc += item.quantity * item.price;
      return acc;
    }, 0);
    const taxAmount = total * .1;
    const subTotal = total - taxAmount;
    const validated = this.validate(this.name, total, taxAmount, subTotal);
    if (!validated) {
      this.showMessage('error-modal');
    } else {
      this.confirmMessage = this.setSuccessMessage(this.name, total, taxAmount, subTotal);
      this.showMessage('confirm-modal');
    }
  }

  setSuccessMessage(name: string, total: number, taxAmount: number, subTotal: number) {
    let output = '';

    const commaIndex = name.indexOf(', ');
    const firstName = name.slice(commaIndex, name.length);
    const lastName = name.slice(0, commaIndex);
    output = `Thank you for your order ${firstName} ${lastName}.
      Your subtotal is: ${subTotal}, your tax amount is: ${taxAmount} and your grand total is: ${total}.`;
    return output;
  }
  // display the order form with orders from orders.json
  displayOrder() {
    this.orders = [{
      "pid": "1",
      "image": "assets/sm_android.jpeg",
      "description": "Android",
      "price": 5.00,
      "quantity": 2
    }, {
      "pid": "2",
      "image": "assets/sm_iphone.jpeg",
      "description": "iPhone",
      "price": 6.00,
      "quantity": 1
    }, {
      "pid": "3",
      "image": "assets/sm_windows.jpeg",
      "description": "Windows",
      "price": 12.00,
      "quantity": 2
    }];

  }
  // Clear the orders form
  clear() {
    this.orders.map((item: IOrder, i: number) => {
      Object.keys(item).map((key: string) => {
        if (key != 'image') {
          item[key] = '';
        }
        return item;
      });
    });
  }

  // Add items 'Android', 'iPhone' and 'Windows' to list when corresponding button is clicked
  addItem(item: string) {
    switch (item) {
      case 'Android':
        this.orders.unshift({
          "pid": "1",
          "image": "assets/sm_android.jpeg",
          "description": "Android",
          "price": 5.00,
          "quantity": 1
        });
        break;
      case 'iPhone':
        this.orders.unshift({
          "pid": "2",
          "image": "assets/sm_iphone.jpeg",
          "description": "iPhone",
          "price": 6.00,
          "quantity": 1
        })
        break;
      case 'Windows':
        this.orders.unshift({
          "pid": "3",
          "image": "assets/sm_windows.jpeg",
          "description": "Windows",
          "price": 12.00,
          "quantity": 1
        })
        break;
    }
  }
  // delete line item (order) when delete button is click

  // read in the orders.json file and populate the list table with the initial orders (3)

}
