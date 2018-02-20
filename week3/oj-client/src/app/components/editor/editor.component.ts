import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { ActivatedRoute, Params } from '@angular/router'
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../services/data.service';

declare var ace: any; // black magic
declare var aceRange: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any;
  editorSessionId: number;

  activeUserSubscription: Subscription;
  activeUsers: number[] = [];

  // this data should be put sperately
  defaultContent = {
    'Java': `class Solution { 
      public static void main(String[] args) { 
        System.out.println(\"Hello World!\");
      }}`,
    'OCaml': `(* OCaml: your code *)`,
    'Python': `# Python: your code`
  }

  // it works even if not in the constructor
  languages: string[] = Object.keys(this.defaultContent);
  selectedLanguage: string;

  // result of the running
  result: object;
  errorMessage: string;

  constructor(private collaborationService: CollaborationService,
              private route: ActivatedRoute,
              private dataService: DataService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.editorSessionId = +params['id'];
      this.initEditor();

      this.collaborationService.init(this.editor, this.editorSessionId);
      // subscribe to active user list
      this.activeUserSubscription = this.collaborationService
        .userList$.subscribe((users: number[]) => {
          this.activeUsers = users;
          console.log('editor comp user list: ' + JSON.stringify(users));
        })
    })
  }

  ngOnDestroy() {
    this.activeUserSubscription.unsubscribe();
    this.collaborationService.disconnect(); // otherwise, one user can have more than one sockets
  }

  initEditor() {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/cobalt");
    
    this.setLanguage(this.languages[0]);
    this.reset();
    // for test
    // let marker = this.editor.session.addMarker(new aceRange(0,5,0,8), 'user-1 edit-marker', true);
  }

  // reset content in editor
  reset() {
    this.editor.setValue(this.defaultContent[this.selectedLanguage]);
    this.editor.getSelection().moveCursorTo(0, 0, 0, false);
  }

  get lang() { return this.selectedLanguage; }
  set lang(which: string) { this.setLanguage(which); }

  // set language
  setLanguage(lang: string) {
    this.selectedLanguage = lang;
    console.log('language set to ' + lang)
    this.editor.session.setMode('ace/mode/' + this.selectedLanguage.toLowerCase());
    this.reset();
  }

  // submit code
  submit() {
    console.log(this.editor.getValue());
    this.dataService.buildAndRun(this.selectedLanguage, this.editor.getValue())
      .then(res => {
        this.errorMessage = null;
        this.result = res;
      })
      .catch(err => {
        this.result = null;
        this.errorMessage = JSON.stringify(err.error);
      });
  }

  obj2string(obj: object) {
    return JSON.stringify(obj);
  }
}
