import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { ActivatedRoute, Params } from '@angular/router'
import { Subscription } from 'rxjs/Subscription';

declare var ace: any; // black magic

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
    'Java': `// Java: your code`,
    'OCaml': `(* OCaml: your code *)`,
    'Python': `# Python: your code`
  }

  // it works even not in the constructor
  languages: string[] = Object.keys(this.defaultContent);

  selectedLanguage: string;

  constructor(private collaborationService: CollaborationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.editorSessionId = +params['id'];
      this.initEditor();

      this.collaborationService.init(this.editor, this.editorSessionId);
      // subscribe to active user list
      this.activeUserSubscription = this.collaborationService
        .user_list$.subscribe((users: number[]) => {
          this.activeUsers = users;
          console.log('editor comp user list: ' + JSON.stringify(users));
        })
    })
  }

  ngOnDestroy() {
    this.activeUserSubscription.unsubscribe();
  }

  initEditor() {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/cobalt");
    
    this.setLanguage(this.languages[0]);
    this.reset();
  }

  // reset content in editor
  reset() {
    this.editor.setValue(this.defaultContent[this.selectedLanguage]);
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
    console.log(this.editor.getValue())
  }
}
