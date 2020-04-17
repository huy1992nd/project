import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//service
import {ApiService} from './api.service'
import {DataService} from './data.service'
import {NotifyService} from './notify.service'
import {HttpService} from './http.service'
import {SocketService} from './socket.service'
import {HelperService} from './helper.service';



@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        
        ],
    providers: [
        ApiService,
        DataService,
        NotifyService,
        HttpService,
        SocketService,
        HelperService
      ],
      
    exports: [
        
    ]
})
export class ServiceModule {}
