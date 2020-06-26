import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatService } from 'src/app/core/services/chat.service';
import { ChatMessage, IChatMessage, messageEnum } from 'src/app/core/models/messages';
import { Contact } from 'src/app/core/models/contact';
import { ContactService } from 'src/app/core/services/contact.service';
import { ClientService } from 'src/app/core/services/client.service';
import { Client } from 'src/app/core/models/client';
import { GlobalVaribale } from 'src/app/core/services/global.service';
import { GroupChatService } from 'src/app/core/services/groupChat.service';
import { GroupChatMessage } from 'src/app/core/models/groupChat';
import { environment } from 'src/environments/environment';
import { Upload } from 'src/app/core/models/upload';
import { UploadService } from 'src/app/core/services/upload.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';


@Component({
    selector: 'app-chat',
    templateUrl: "./chat.component.html",
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
    @ViewChild("profilePicLabel", { static: false }) profilePicLabel: ElementRef;
    @ViewChild("messageBox", { read: ElementRef, static: false }) messageBox: ElementRef;
    @ViewChild('uploadButton', { static: false }) uploadButton: ElementRef;

    contact$: Contact[] = [];
    tempContact$: Contact[] = [];
    originalContacts$: Contact[] = [];
    selectedContact: Contact;
    messageText: string;
    chatMessages: ChatMessage[] = [];
    clientDetails: Client[] = []
    tempClientDetails: Client[] = []
    allClientBoolean: Boolean = false;
    selfId;
    groupChatDetails: GroupChatMessage[] = [];
    allContacts: any = [];
    groupMessage: boolean = false;
    selectedMultiSelect = []
    dropdownSettings: IDropdownSettings = {};
    public newfile: any;
    public selectedFile: any;
    dummyGroupImageUrl = environment.dummyGroupImageUrl;
    groupCreateLoading: boolean = false
    showSettingsButton: boolean = false
    defaultCreateGroupType: string = 'create';
    ngModelValues: any;
    selectAllValuesToAppend: any;
    constructor(private _contactService: ContactService,
        private _chatService: ChatService,
        private _clientService: ClientService,
        private _groupChatService: GroupChatService,
        private _upSvc: UploadService
    ) { }


    ngOnInit() {
        this.selfId = localStorage.getItem(GlobalVaribale.clientId)
        this.onInitSettings();

    }

    ngAfterViewInit() {

    }

    onInitSettings() {
        this._contactService.getContacts().subscribe(newContacts => {
            this.contact$ = newContacts.map(contact => contact as Contact);
            this.contact$ = this.contact$.sort(function (a, b) {
                return (b.lastMessageTime.getTime()) - (a.lastMessageTime.getTime());
            });
            this.tempContact$ = this.contact$;
            this.getGroupChatMessages();
        });
        this.getAllRegisteredClients();
        this.initializeDropDownSettings();
        this.initializeNgModalValues();
    }
    initializeNgModalValues() {
        this.ngModelValues = {
            name: '',
            receiver: [

            ],
            profileImageUrl: this.dummyGroupImageUrl
        };
        // adding self to the group chat object
        this.addSelfToTheReceiver()

    }
    getAllRegisteredClients() {
        this._clientService.getAllClients().subscribe(client => {
            this.clientDetails = client as Client[];
            this.tempClientDetails = this.clientDetails;
        })
    }
    getGroupChatMessages() {
        this._groupChatService.getRelatedGroupsOfContact(this.selfId).subscribe(groupChatMessage => {
            this.groupChatDetails = groupChatMessage.map(v => new GroupChatMessage(v.payload.doc.data(), v.payload.doc.id));
            this.allContacts = [...this.contact$, ...this.groupChatDetails]
            this.allContacts = this.allContacts.sort((a, b) => {
                return (b.lastMessageTime.getTime()) - (a.lastMessageTime.getTime())
            })

        })
    }


    selectContact(contact: Contact) {

        this.selectedContact = contact;
        this.showSettingsButton = contact.group;
        if (contact.id !== this.selfId && contact.lastMessageStatus == messageEnum.received) {
            this._contactService.updateLastMessageStatus(contact.id);
        }

        contact.group ? this.getGroupMessage(contact.id) : this.getMessages();
        setTimeout(() => {
            this.messageBox.nativeElement.scrollTop += this.messageBox.nativeElement.scrollHeight + 2000;
        }, 575);
    }

    getMessages() {
        let self = this;
        this.groupMessage = false;
        this._chatService.getMessages(this.selectedContact.id).subscribe(
            v => {
                setTimeout(() => {
                    this.messageBox.nativeElement.scrollTop += 2000;

                });
                this.chatMessages = v.sort(function (a, b) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return (a.time.getTime()) - (b.time.getTime());
                })

            }
        );

    }
    getGroupMessage(messageId) {
        this.groupMessage = true;
        this._chatService.getGroupChatMessage(messageId).subscribe(
            v => {
                setTimeout(() => {
                    this.messageBox.nativeElement.scrollTop += 2000;
                });
                this.chatMessages = v.sort(function (a, b) {
                    return (a.time.getTime()) - (b.time.getTime())
                })
            })
    }


    sendMessage(group?) {
        if (this.messageText.trim().length != 0) {
            let message: any = {};
            message.message = this.messageText;
            message.senderId = this.selfId;
            message.time = new Date();
            message.messageStatus = messageEnum.sent;
            message.group = group ? true : false;
            if (!group) {
                message.receiverId = this.selectedContact.id;
            } else {
                message.senderName = localStorage.getItem(GlobalVaribale.fullName);
            }
            if (this.selectedContact) {
                group ? this.sendGroupMessage(message, this.selectedContact.id) : this.sendIndividualMessage(message, this.selectedContact.id);
                // setTimeout(() => {
                //     this.messageBox.nativeElement.scrollTop = 2000;

                // }, 100);

            }
            else {
                this.contact$.forEach(
                    (v, index) => {
                        this._chatService.addMessage(message, v.id, () => {
                            v.lastMessage = message;
                            if (index == (this.contact$.length - 1)) {
                                this.messageText = '';
                            }
                        })
                    }
                )
            }
        }


    }
    sendIndividualMessage(message, id) {
        this._chatService.addMessage(message, id, () => {
            this.messageText = '';
            this.contact$.forEach(
                v => {
                    if (v.id == this.selectedContact.id) {
                        v.lastMessage = message.message;
                        v.lastMessageTime = message.time;
                    }
                }
            )
            this.messageBox.nativeElement.scrollTop += 2000;
            this.contact$ = this.contact$.sort(function (a, b) {
                return (b.lastMessageTime.getTime()) - (a.lastMessageTime.getTime());
            })

        })

    }
    sendGroupMessage(message, id) {
        this._chatService.addGroupMessage(message, id, () => {
            this.messageText = '';
            this.allContacts.forEach((v, index) => {
                if (v.id == this.selectedContact.id) {
                    v.lastMessage = message.message;
                    v.lastMessageTime = message.time;
                }
            })
            this.messageBox.nativeElement.scrollTop += 2000;
            this.allContacts = this.allContacts.sort(function (a, b) {
                return (b.lastMessageTime.getTime()) - (a.lastMessageTime.getTime());
            })
        })

    }


    searchData(searchData) {
        this.contact$ = this.tempContact$;
        this.contact$ = this.contact$.filter(
            v => {
                return v.name.toLowerCase().indexOf(searchData.toLowerCase()) !== -1;

            }
        );
    }

    searchClientsData(searchData: string) {
        this.allClientBoolean = false;
        if (searchData.length > 0) {
            let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let searchField;
            this.clientDetails = this.tempClientDetails;
            if (emailRegex.test(String(searchData).toLowerCase())) {
                searchField = "email";
            } else if (Number(parseInt(searchData, 10))) {
                searchField = "phoneNumber";
            } else {
                searchField = "name";
            }
            this.clientDetails = this.clientDetails.filter(v => {
                return v[searchField].toLowerCase().indexOf(searchData.toLowerCase()) !== -1;
            })
            this.allClientBoolean = true;
        }

    }

    // -------------------------------- multi select dropdown code starts here ------------------------------------------------------
    dropDownOnItemSelect(item: any) {
        // console.log(item);
    }
    dropDownOnSelectAll(items: any) {
        let selfItemObject = {
            id: localStorage.getItem(GlobalVaribale.clientId),
            name: localStorage.getItem(GlobalVaribale.fullName),
            isDisabled: undefined
        }
        //doing this as the value returned from the child is async
        setTimeout(() => {
            items.push(selfItemObject)
            this.selectAllValuesToAppend = items;
        });

    }
    initializeDropDownSettings() {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 10,
            allowSearchFilter: true
        };
    }
    fileCheck(event) {
        let reader = new FileReader();
        let self = this;
        reader.onload = function () {
            var dataURL = reader.result;
            self.newfile = dataURL;
        };
        this.selectedFile = event.target.files.item(0);
        reader.readAsDataURL(event.target.files[0]);
        this.profilePicLabel.nativeElement.innerText = this.selectedFile.name;

    }

    proceedToGroupCreation(type) {
        this.groupCreateLoading = true
        if (this.selectedFile) {
            let currentUpload = new Upload(this.selectedFile);
            this._upSvc.pushUploadToVehicles(
                currentUpload,
                "/groupImages",
                (progressData) => {
                    let progress = Math.round(progressData);
                    this.uploadButton.nativeElement.innerHTML = "Uploading Img: " + progress + '%';
                },
                (uploaded: Upload) => {
                    this.uploadButton.nativeElement.innerHTML = `${this.defaultCreateGroupType == "create" ? "Creating Group" : "Updating Group"}`;
                    this.ngModelValues.profileImageUrl = uploaded.url;
                    this.createGroup(type)
                }
            );
        } else {

            this.ngModelValues.profileImageUrl = environment.dummyGroupImageUrl;
            this.createGroup(type)
        }
    }
    createGroup(type) {
        //checking to see if the user has selected all option from the dropdown to append the values to the receiver list
        if (this.selectAllValuesToAppend && this.selectAllValuesToAppend.length > 0) {
            this.ngModelValues.receiver = this.selectAllValuesToAppend;
        }
        let groupMessageAttr: GroupChatMessage = {
        }
        groupMessageAttr.name = this.ngModelValues.name;
        //filtering out other data and just storing the id into the receiver array
        groupMessageAttr.receiver = this.ngModelValues.receiver.map(v => {
            if (v.id) {
                return v.id
            }
            return v;
        })
        groupMessageAttr.profileImageUrl = this.ngModelValues.profileImageUrl;
        if (type == "create") {
            groupMessageAttr.group = true;
            groupMessageAttr.lastMessage = `Welcome to ${groupMessageAttr.name} group`
            groupMessageAttr.lastMessageTime = new Date();
            this._groupChatService.createNewGroupChat(groupMessageAttr).then(v => {
                this.groupCreateLoading = false;
                $('button#closeTheModal').trigger("click");
                $('modal-backdrop').remove();
                this.onInitSettings();
                this.defaultCreateGroupType = 'create'
            })
        } else {
            this._groupChatService.updateGroupChatSetting(this.selectedContact.id, groupMessageAttr).then(v => {
                this.groupCreateLoading = false;
                $('button#closeTheModal').trigger("click");
                $('modal-backdrop').remove();
                this.onInitSettings();
                this.defaultCreateGroupType = 'create'
            });
        }

    }

    populateData() {

        this.ngModelValues.name = this.selectedContact.name;
        this.ngModelValues.profileImageUrl = this.selectedContact.profileImageUrl;
        //mapping the receiver type for id and name to display it in the ngModelValues.receiver
        this.ngModelValues.receiver = this.selectedContact.receiver.map((data, index) => {
            let newDataObjectForNames = {}
            let filteredData = this.tempClientDetails.filter(v => {
                if (v.id == data) {
                    return v.name
                }
            })
            newDataObjectForNames['id'] = filteredData[0].id;
            newDataObjectForNames['name'] = filteredData[0].name;
            return newDataObjectForNames
        })
        this.defaultCreateGroupType = 'update'
    }
    leaveGroupChat() {
        let receivers = this.selectedContact.receiver.filter(v => v !== this.selfId);
        let newMessageObject: GroupChatMessage = {}
        newMessageObject.receiver = receivers;
        newMessageObject.lastMessage = `${this.selfId} has left the group`;
        newMessageObject.lastMessageTime = new Date();
        this._groupChatService.leaveGroup(newMessageObject, this.selectedContact.id);
    }

    addSelfToTheReceiver() {
        //creating a receiver object with self name and id to display the same thing on the dropdown filtering against all the registered clients instead of tempContact$
        this.ngModelValues.receiver = this.tempClientDetails.filter(v => {
            if (v.id == this.selfId) {
                return v.id
            }
        });
    }
}
