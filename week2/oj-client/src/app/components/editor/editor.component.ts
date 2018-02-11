import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';

declare var ace: any; // black magic

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any;

  // this data should be put sperately
  defaultContent = {
    'Java': `// Java: your code`,
    'OCaml': `# OCaml: your code`,
    'Python': `# Python: your code`
  }

  // it works even not in the constructor
  languages: string[] = Object.keys(this.defaultContent);

  selectedLanguage: string;

  constructor(private collaborationService: CollaborationService) { }

  ngOnInit() {
    this.init();
    this.collaborationService.init(this.editor);
  }

  init() {
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

  }
}
