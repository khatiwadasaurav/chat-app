import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatService } from 'src/app/core/services/chat.service';
import { ChatRoutingModule } from './chat.routing.module';
import { ContactService } from 'src/app/core/services/contact.service';
import { ClientService } from 'src/app/core/services/client.service';
import { GroupChatService } from 'src/app/core/services/groupChat.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



@NgModule({
    imports: [
        CommonModule,
        ChatRoutingModule,
        //for new data table
        FormsModule,
        // DataTableModule,
        HttpClientModule,
        NgMultiSelectDropDownModule.forRoot(),


    ],
    exports: [RouterModule],
    declarations: [ChatRoutingModule.components],
    providers: [ContactService, ChatService, ClientService, GroupChatService]
})
export class ChatModule { }
