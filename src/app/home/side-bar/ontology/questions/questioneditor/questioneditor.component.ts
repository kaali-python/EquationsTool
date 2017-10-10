import { Component, OnInit, OnDestroy, EventEmitter, Output, Input, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';

import {State, Store} from "@ngrx/store"
import { Observable, ObservableInput } from 'rxjs/Observable';
import {ApplicationStore} from "../../../../../app.store"
import {MaterializeDirective} from "angular2-materialize";
import * as Materialize from 'angular2-materialize';
import * as fromRoot from '../../../../../reducers';
import * as actions from '../../../../../actions/question.actions';
import {NanoskillModel} from '../../../../../models/nanoskill.model';
import {QuestionModel} from '../../../../../models/question.model';
import {UserModel} from '../../../../../models/user.model';
import { toast } from 'angular2-materialize';

declare var $:any;


@Component({
  selector: 'app-questioneditor',
  templateUrl: './questioneditor.component.html',
  styleUrls: ['./questioneditor.component.css']
})
export class QuestioneditorComponent implements OnInit {
    @Input()
    //@Output() selectedSubconcept = new EventEmitter<SubconceptModel>();


    private module: QuestionModel;
    private selectedNanoskill: NanoskillModel
    private user: UserModel
    private options: Object
    private editorContent
    private imageUrl: string = "http://localhost:8000/uploadimage"

    constructor(private store: Store<fromRoot.AppState>) {
        this.store.select(fromRoot.getSelectedQuestion)
            .subscribe(value => {
               this.module = value
            });

        this.store.select(fromRoot.getAuthenticatedUser)
            .subscribe(value => {
            console.log("Authenticated user" + value.user_id)
            this.user = value
        });


        this.store.select(fromRoot.getSelectedNanoskill)
            .subscribe(value => {
               this.selectedNanoskill = value
        });



   }
      

  ngOnInit() {
         //Drggable option is available on froala, search for it and use it
        this.options =  {
                    beforeUpload: function (e, editor, images) {
                    },
                    
                    module_id: this.module.module_id,
                    placeholderText: 'Edit Your Question Here!',
                    charCounterCount: true,
                    // Set the image upload parameter.
                    imageUploadParam: 'image_data',
                    
                    // Set the image upload URL.
                    imageUploadURL: this.imageUrl,
                    draggable: true,
                    dragInline: true,
                    imageMove: true,
                    videoMove: true,
                    
                    // Additional upload params.
                    imageUploadParams: {"random": "some", "user_id": this.user.user_id, "parent_id": this.selectedNanoskill.module_id, "module_id": this.module.module_id },
                    
                    // Set request type.
                    imageUploadMethod: 'POST',
                    
                    // Set max image size to 5MB.
                    imageMaxSize: 5 * 1024 * 1024,
                    
                    // Allow to upload PNG and JPG.
                    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                    events: {
                        'froalaEditor.initialized': function() {
                                console.log('initialized');
                        },
                    
                        'froalaEditor.image.beforeUpload': function (e, editor, images){
                                var reader = new FileReader();
                                reader.addEventListener("load", function () {
                                    console.log("No use of converting this image to base64");
                                }, false);
                        
                                if (images[0]) {
                                    var data = reader.readAsDataURL(images[0]);
                        }
                    },

                        'froalaEditor.image.beforeDeleteImage': function(i){
                          console.log(i)

                        },
                    
                     'froalaEditor.image.resizeEnd': function(e, editor, $img){
                       console.log($img)
                         
                     },
                     

                     'froalaEditor.image.removed': function(e, editor, $img){
                            console.log($img)
                            let currentUrl = $img[0].currentSrc;
                            var currentUrlSplit = currentUrl.split("/");
                            console.log(currentUrlSplit)
                            let intermediate = currentUrlSplit[currentUrlSplit.length - 1];
                            let imageName = intermediate.split("?")
                            console.log(imageName)
                            console.log(imageName[0])
                            console.log(this.module_id)
                            console.log(this.selectedNanoskill)
                            $.ajax({
                                  url: "http://localhost:8000/uploadimage",
                                  type: 'DELETE',
                                  //dataType: type,
                                  data: {"image_name": imageName[0], "parent_name": currentUrlSplit[5], "module_id": currentUrlSplit[6]},
                                }).done(function(data) {
                                    toast(data.message, 4000);
                                });
                    
                          },
      
                     'froalaEditor.imageManager.imageDeleted': function(e, editor, data){
                          console.log(data)

                        },

                    'froalaEditor.image.replaced': function(e, editor, $img, response){
                            console.log("Image is deleted")
                    },
                    }
                    };


  }

}
