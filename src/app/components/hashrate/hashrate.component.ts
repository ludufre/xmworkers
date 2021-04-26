import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hashrate',
  templateUrl: './hashrate.component.html',
  styleUrls: ['./hashrate.component.scss']
})
export class HashrateComponent implements OnInit {

  @Input() type = 'primary';
  @Input() value: number;
  @Input() class: string;

  constructor(
  ) { }

  ngOnInit(): void {

  }
}
