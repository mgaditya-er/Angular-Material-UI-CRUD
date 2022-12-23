import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AngularCrud';
  displayedColumns: string[] = ['id','productName', 'category', 'freshness', 'price','comment','date','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog,private api:ApiService) {}
  ngOnInit(): void {
    this.getAllProduct();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
     width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save')
      {
          this.getAllProduct();
      }
    })
}
  getAllProduct(){
      this.api.getProduct()
      .subscribe(
        {
          next:(res)=>{
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;


          },
          error:(err)=>{
            alert("Error while fetching Records");
          }

        }
      )
  }

  deleteProduct(id:number){
    this.api.deleteProduct(id).subscribe({
      next:(res)=>
      {
        alert("deleted successfully");
        this.getAllProduct();
      },
      error:()=>
      {
        alert("Error while deleting Records")

      }
    })

  }
  editproduct(row:any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update')
      {
          this.getAllProduct();
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

