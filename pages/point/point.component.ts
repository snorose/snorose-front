import { Component, inject, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DalService } from '../../shared/services/dal.service';
import { IGetMonthPointResponse } from '../../shared/http/point.http';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrl: './point.component.scss'
})
export class PointComponent implements OnInit {

  private readonly dalService = inject(DalService);

  private rawData = [
    { id: 0, difference: 2, createdAt: '2024-06-01T10:39:40.274Z' },
    { id: 0, difference: 3, createdAt: '2024-06-02T10:39:40.274Z' },
    { id: 0, difference: 3, createdAt: '2024-06-03T10:39:40.274Z' },
    { id: 0, difference: 3, createdAt: '2024-06-04T10:39:40.274Z' },
    { id: 0, difference: 3, createdAt: '2024-06-05T10:39:40.274Z' },
    { id: 0, difference: 1, createdAt: '2024-06-06T10:39:40.274Z' },
    { id: 0, difference: 2, createdAt: '2024-06-12T10:39:40.274Z' },
    { id: 0, difference: 1, createdAt: '2024-06-15T10:39:40.274Z' },
    { id: 0, difference: 7, createdAt: '2024-06-21T10:39:40.274Z' },
    { id: 0, difference: 2, createdAt: '2024-06-24T10:39:40.274Z' },
    { id: 0, difference: 1, createdAt: '2024-06-26T10:39:40.274Z' },
    { id: 0, difference: 4, createdAt: '2024-06-30T10:39:40.274Z' }
  ];
  private data: { date: Date, difference: number }[] = [];
  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() { }

  ngOnInit(): void {
    this.prepareData();
    this.createSvg();
    this.drawPlot();
  }

  private prepareData(): void {
    // 전체 6월 날짜 범위 생성
    const startDate = new Date('2024-06-01');
    const endDate = new Date('2024-07-01');
    const dateArray: Date[] = [];
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      dateArray.push(new Date(d));
    }

    // 데이터 없는 날짜를 0으로 설정
    this.data = dateArray.map(date => {
      const dataPoint = this.rawData.find(d => this.isSameDate(new Date(d.createdAt), date));
      return {
        date: new Date(date),
        difference: dataPoint ? dataPoint.difference : 0
      };
    });
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  private createSvg(): void {
    this.svg = d3.select('figure#lineChart')
      .append('svg')
      .attr('width', this.width + (this.margin * 2))
      .attr('height', this.height + (this.margin * 2))
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawPlot(): void {
    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.date) as [Date, Date])
      .range([0, this.width]);

    this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x).tickFormat((domainValue: Date | d3.NumberValue, index: number) => {
        return d3.timeFormat("%B %d")((domainValue as Date));
      }));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.difference) as number])
      .range([this.height, 0]);

    this.svg.append('g')
      .call(d3.axisLeft(y));

    // Add the line
    const line = d3.line<{ date: Date, difference: number }>()
      .x(d => x(d.date))
      .y(d => y(d.difference));

    this.svg.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  }

}
