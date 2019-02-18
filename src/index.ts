import { LitElement, html, customElement, property } from '@polymer/lit-element';
import './@graviton/button';
import './@graviton/input.ts';

@customElement('linr-app')
export class LinrApp extends LitElement {
  
  @property({reflect:true})
  state: string = "";

  @property()
  rerender: number = 0;

  appData: any = {"projects":[]};

  constructor() {
    super();
    this.state = document.location.pathname.split('/').shift().toString();
    if (localStorage.getItem('projects') == null) {
      localStorage.setItem('projects', JSON.stringify([]));
    } else {
      this.appData.projects = JSON.parse(localStorage.getItem('projects'));
    }
    window.onpopstate = (event: any) => {
      let page = document.location.pathname.split('/');
      page.shift();
      this.state = page.toString();
    }
  }

  isState(query: string): boolean {
    return this.state == query;
  }
  isQuizPage(): boolean {
    return this.state.split(',')[0] == 'quiz';
  }

  cleanAdd() {
    this.editAct = false;
    this.editIndex = null;
  }

  pageBackground: string;

  tileBox: any;

  pageCharacter: string;

  actData: any;

  editAct: boolean = false;

  editIndex: number;

  render() {
    return html`
      <style>
        header {
          position:fixed;
          top:0px;
          left:0px;
          width:100%;
          height:3.5rem;
          background-color:rgba(255, 255, 255, 0.9);
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:3;
        }
        h1 {
          font-size:2rem;
          text-align:center;
          margin:0px;
          cursor:pointer;
        }
        .projects {
          margin-top:3.5rem;
        }
        .project {
          position:-webkit-sticky;
          position:sticky;
          top:3.5rem;
          height:3rem;
          margin:0px;
          background-color:rgba(255, 255, 255, 0.9);
          backdrop-filter:blur(10px);
          z-index:2;
          outline: 0px;
          font-size:1.25rem;
          transition:background-color 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
          display:flex;
          align-items:center;
          transform: translate(-8px);
          width:calc(100% + 16px);
        }
        .project > .title {
          color:#777;
        }
        .project-buttons {
          position:absolute;
          right:8px;
        }
        .tile-container {
          overflow:hidden;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-gap: 8px;
          transform-origin:0% 0%;
          transition:transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        .tile-container.hide {
          display:none;
        }
        .tile {
          box-sizing:border-box;
          position:relative;
          width:100%;
          height:100%;
          border-radius:8px;
          color:white;
          padding:8px;
          cursor:pointer;
          text-align:center;
        }
        .tile > * {
          pointer-events: none;
        }
        .tile:nth-child(5n+1) {
          background:linear-gradient(90deg, #f44336, #ff9800);
        }
        .tile:nth-child(5n+2) {
          background:linear-gradient(90deg, #ff9800, #4caf50);
        }
        .tile:nth-child(5n+3) {
          background:linear-gradient(90deg, #4caf50, #2196f3);
        }
        .tile:nth-child(5n+4) {
          background:linear-gradient(90deg, #2196f3, #9c27b0);
        }
        .tile:nth-child(5n+5) {
          background:linear-gradient(90deg, #9c27b0, #f44336);
        }
        .fab {
          position:fixed;
          bottom:1rem;
          right:1rem;
          z-index:2;
          background-color:#2196f3;
          box-shadow: 0px 3px 6px rgba(33, 150, 243, 0.16);
          padding:0px 1.25rem;
          height:3rem;
          display:flex;
          justify-content:center;
          align-items:center;
          border-radius:1.5rem;
          color:white;
          cursor:pointer;
        }
        img {
          height:1em;
        }
      </style>
      <header>
        <h1><img src="logo/logo-home.png"></h1>
      </header>
      <div class="projects">
        ${this.appData['projects'].map((project: any, index: number) => {
          return html`
            <div>
              <h2 class="project ${project.hidden ? 'hide' : 'show'}">
              <span class="character">${project['character']} </span> 
              <span class="title">${project['title']}</span> 
              <div class="project-buttons"><gvt-button @click=${() => {
                let blob = new Blob([JSON.stringify(this.appData.projects[index])]);
                let a = document.createElement('a');
                a.download = `${project.title}.linr`;
                a.href = URL.createObjectURL(blob);
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
              }}>Download .linr File</gvt-button><gvt-button @click=${() => {
                this.editAct = true;
                this.editIndex = index;
                this.state = 'add';
                window.history.pushState({"page":"add"},"add","/add");
                this.rerender++;
              }}>Edit</gvt-button></div></h2>
              <div class="tile-container ${project.hidden ? 'hide' : 'show'}">
                ${project['acts'].map((act: any, index: number) => {
                  return html`<div tabindex="0" class="tile" @click=${(event: any) => {
                    document.documentElement.style.overflowY = 'hidden';
                    this.pageBackground = window.getComputedStyle(event.target).backgroundImage;
                    this.tileBox = event.target.getBoundingClientRect();
                    this.pageCharacter = project['character'];
                    this.state = `quiz,${project['title']},${act.act}`;
                    this.actData = act;
                    window.history.pushState({
                      page:'quiz',
                      project:project['title'],
                      act:act.act
                    }, `${project['title']} Act ${act.act}`, `/quiz/${project['title']}/${act.act}`);
                  }}>
                    <h1>${project['character']}</h1>
                    <h2>${project['title']}</h2>
                    <h3>Act ${act.act}</h3>
                  </div>`;
                })}
              </div>
            </div>
          `;
        })}
      </div>
      ${this.isQuizPage() ? html`<linr-page .tilebox=${this.tileBox} character=${this.pageCharacter} project=${this.state.split(',')[1]} .act=${this.actData} background=${this.pageBackground}
      .close=${() => {
        this.state = "";
        window.history.pushState({"page":""},"","/");
      }}></linr-page>` : null}
      <div class="fab" tabindex="0" @click=${() => {
        this.state = 'add';
        window.history.pushState({"page":"add"},"add","/add");
        this.rerender++;
      }}>Add Project</div>
      ${this.isState('add') ? html`<linr-add ?edit=${this.editAct} .addProject=${(project: any) => {
        this.appData.projects.push(project);
        this.state = "";
        window.history.pushState({"page":""},"","/");
        this.rerender++;
        localStorage.setItem('projects', JSON.stringify(this.appData.projects));
        this.cleanAdd();
      }} .saveEditedProject=${(project: any) => {
        this.appData.projects[this.editIndex] = project;
        this.state = "";
        window.history.pushState({"page":""},"","/");
        this.rerender++;
        localStorage.setItem('projects', JSON.stringify(this.appData.projects));
        this.cleanAdd();
      }} .deleteProject=${(isDelete: boolean) => {
        if (this.editAct && isDelete) {
          if (confirm('Are you sure you want to delete this Project?')) {
            this.appData.projects.splice(this.editIndex, 1);
            this.state = "";
            window.history.pushState({"page":""},"","/");
            localStorage.setItem('projects', JSON.stringify(this.appData.projects));
          }
        } else {
          if (confirm('Are you sure you want to cancel? Any unsaved information will be lost.')) {
            this.state = "";
            window.history.pushState({"page":""},"","/");
          }
        }
        this.cleanAdd();
      }} title=${this.editAct ? this.appData.projects[this.editIndex].title : ""} character=${this.editAct ? this.appData.projects[this.editIndex].character : ""} .acts=${this.editAct ? this.appData.projects[this.editIndex].acts : [{act:1, lines:[]}]}></linr-add>` : null}
    `;
  }

}

@customElement('linr-page')
class LinrPage extends LitElement {

  @property({type:Boolean})
  hide: boolean = true;

  @property({type:String})
  project: string;

  @property({type:Object})
  act: any;

  @property({type:String})
  background: string;

  @property({type:String})
  character: string;

  @property()
  tilebox: any;

  @property()
  rerender: number = 0;

  @property({type:Object})
  quiz: Array<any> = [];

  @property({type:Number})
  quizIndex: number = 0;

  @property({type:String})
  quizState: string = 'before';

  @property({type:Function})
  close: Function;

  answers: Array<any> = [];

  animation: any = {
    width: null,
    height: null,
    top: null,
    left: null,
    borderRadius:8,
    overflow:'hidden'
  }

  generateQuiz() {
    const order: Array<any> = this.shuffleArray(this.act.lines);
    let questionType: Array<number> = [];
    for (let line in order) {
      questionType.push(Math.round(Math.random()));
    }
    let questions: Array<any> = [];
    for (let i=0;i<questionType.length;i++) {
      if (questionType[i] == 0) {
        const words: Array<string> = order[i].line.split(" ");
        const count: number = words.length-1;
        const missingWords: number = Math.round(Math.random()*4)+1;
        const wordsToReplace: any = [];
        const answers: any = [];
        const getWords = (): number => {
          let index = Math.round(Math.random()*count);
          if (wordsToReplace.includes(index)) {
            return getWords();
          } else {
            return index;
          }
        }
        for (let i=0; i<missingWords; i++) {
          wordsToReplace.push(getWords());
        }
        wordsToReplace.sort((a: any, b: any) => a - b);
        for (let index=0; index<wordsToReplace.length;index++) {
          const val = wordsToReplace[index];
          const word: string = words[val];
          let lastLetter: string = "";
          if (word.includes('),')) {
            const letters: Array<string> = word.split('');
            lastLetter = letters.pop();
            lastLetter += letters.pop();
            const newWord: string = letters.join('');
            answers.push(newWord);
            words[val] = `_____${lastLetter}`;
          } else if (word.includes('.') || word.includes(',') || word.includes(';') || word.includes(':') || word.includes(')') || word.includes('!')) {
            const letters: Array<string> = word.split('');
            lastLetter = letters.pop();
            const newWord: string = letters.join('');
            answers.push(newWord);
            words[val] = `_____${lastLetter}`;
          } else if (word.includes('(')) {
            const letters: Array<string> = word.split('');
            lastLetter = letters.shift();
            const newWord: string = letters.join('');
            answers.push(newWord);
            words[val] = `${lastLetter}_____`;
          } else {
            answers.push(words[val]);
            words[val] = '_____';
          }
        }
        questions.push({line:words.join(' '),type:0,answers:answers,missingWords:missingWords});
      } else {
        const previousLine = order[i].previousLine;
        const options: any = [];
        const getLines = (): string => {
          const index: number = Math.round(Math.random()*(order.length-1));
          if (index == i || options.includes(order[index].line)) {
            return getLines();
          } else {
            return order[index].line;
          }
        }
        for (let i=0; i<3; i++) {
          options.push(getLines());
        }
        const answer = order[i].line;
        options.push(answer);
        const mixedOptions = this.shuffleArray(options);
        questions.push({options:mixedOptions,answer:answer,previousLine:previousLine,type:1});
      }
    }
    return questions;
  }

  shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  connectedCallback() {
    this.animation.width = this.tilebox.width + 'px';
    this.animation.height = this.tilebox.height + 'px';
    this.animation.top = this.tilebox.top;
    this.animation.left = this.tilebox.left;
    setTimeout(() => {
      this.animation.width = '100%';
      this.animation.height = '100%';
      this.animation.top = 0;
      this.animation.left = 0;
      this.animation.borderRadius = 0;
      this.hide = false;
      this.rerender++;
    }, 16);
    setTimeout(() => {
      this.animation.overflow = 'auto';
      this.rerender++;
    }, 400);
  }

  isState(query: string) {
    return this.quizState == query;
  }

  isIndex(query: number) {
    return this.quizIndex == query;
  }

  checkedAnswers: Array<any> = [];
  correctCount: number = 0;

  checkAnswers() {
    this.correctCount = 0;
    for (let index = 0; index < this.quiz.length; index++) {
      const question = this.quiz[index];
      if (question.type == 0) {
        const given = this.answers[index];
        given.forEach((answer: string, index: number) => {
          given[index] = answer.toLowerCase();
        });
        const answers: any = question.answers;
        answers.forEach((answer: string, index: number) => {
          answers[index] = answer.toLowerCase();
        });
        const answersString = answers.join(", ");
        const givenString = given.join(", ");
        const right = givenString == answersString;
        if (right) {
          this.correctCount++;
        }
        this.checkedAnswers.push({right:right,correct:answersString,given:givenString,type:0});
      } else {
        const right = question.answer = this.answers[index];
        const correct = question.answer;
        const given = this.answers[index];
        if (right) {
          this.correctCount++;
        }
        this.checkedAnswers.push({right:right,correct:correct,given:given,type:1});
      }
    };
  }

  disconnectedCallback() {
    document.documentElement.style.overflowY = 'initial';
  }

  render() {
    const percentage: number = this.correctCount / this.quiz.length *100;
    return html`
      <style>
        .animation {
          box-sizing:border-box;
          position:absolute;
          width:${this.animation.width};
          height:${this.animation.height};
          top:${this.animation.top}px;
          left:${this.animation.left}px;
          border-radius:${this.animation.borderRadius}px;
          color:white;
          padding:8px;
          cursor:pointer;
          text-align:center;
          background:${this.background};
          transition:width 0.4s cubic-bezier(0.4, 0.0, 0.2, 1),
            height 0.4s cubic-bezier(0.4, 0.0, 0.2, 1),
            top 0.4s cubic-bezier(0.4, 0.0, 0.2, 1),
            left 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
          overflow:${this.animation.overflow};
        }
        h1 {
          margin:0px;
        }
        .container {
          position:fixed;
          width:100%;
          height:100%;
          top:0px;
          left:0px;
          z-index:3;
        }
        main {
          box-sizing:border-box;
          position:relative;
          margin-top:8px;
          padding:8px;
          width:100%;
          background-color:white;
          color:black;
          border-radius:8px;
        }
      </style>
      <div class="container">
        <div class="animation">
          <h1>${this.character}</h1>
          <h2>${decodeURIComponent(this.project)}</h2>
          <h3>Act ${this.act.act}</h3>
          <main class="before" ?hidden=${!this.isState('before')}>
            <h4>Lines</h4>
            <gvt-button @click=${()=>{
              this.close();
            }}>Close</gvt-button>
            <ol>
              ${this.act.lines.map((line: any, index: number) => {
                return html`<li>${line.line}</li>`;
              })}
            </ol>
            <gvt-button @click=${() => {
              this.quiz = this.generateQuiz();
              this.quizState = 'quiz';
            }}>Start Quiz</gvt-button>
          </main>
          <main class="quiz" ?hidden=${!this.isState('quiz')}>
            <h4>Question ${this.quizIndex+1} of ${this.quiz.length}</h4>
            ${this.quiz.map((question:any, index:number) => {
                const isSelected = index == this.quizIndex;
                return html`
                  <linr-question ?hidden=${!isSelected} .question=${question} index=${index} .setAnswer=${(answer: any, index: number) => {
                    this.answers[index] = answer;
                  }}></linr-question>
                `;
            })}
            <gvt-button ?disabled=${this.isIndex(0)} @click=${() => {
              this.quizIndex--;
            }}>Previous</gvt-button>
            <gvt-button @click=${() => {
              this.quizIndex++;
              if (this.quizIndex >= this.quiz.length) {
                this.checkAnswers();
                this.quizState = 'answer';
              }
            }}>Next</gvt-button>
          </main>
          <main class="answer" ?hidden=${!this.isState('answer')}>
            <h4>Results <gvt-button @click=${() => {
              this.close();
            }}>Close</gvt-button></h4>
            <h1>${percentage}%</h1>
            ${this.checkedAnswers.map((answer: any, index: number) => {
              return html`
                <div>
                  <h4 style="color:${answer.right ? '#4caf50' : '#f44336'}">Question ${index+1}</h4>
                  <p>You chose <b>${answer.given}</b></p>
                  <p>The correct answer is <b>${answer.correct}</b></p>
                </div>
              `;
            })}
          </main>
        </div>
      </div>
    `;
  }
}

@customElement('linr-question')
class LinrQuestion extends LitElement {

  @property({type:Boolean})
  hidden: boolean;

  @property({type:Object})
  question: any;

  @property({type:Function})
  setAnswer: Function;

  @property({type:Number})
  index: number;

  @property()
  selectedAnswer: any;

  isAnswer(query: any) {
    return this.selectedAnswer == query;
  }

  render() {
    if (this.question.type == 0) {
      const line = this.question.line;
      const missingWords = this.question.missingWords;
      const isPlural = missingWords > 1;
      const answers: Array<string> = this.question.answers;
      const selected: Array<string> = [];
      return html`
        <h4>Fill In The Blank${isPlural ? 's' : ''}</h4>
        <p>${line}</p>
        ${answers.map((answer: string, index: number) => {
          return html`
            <gvt-input @input=${(event: any) => {
              selected[index] = event.target.value;
              this.setAnswer(selected, this.index);
            }}>Blank ${index+1}</gvt-input>
          `;
        })}
      `;
    } else {
      const line: string = this.question.previousLine;
      const options: Array<string> = this.question.options;
      const answer: string = this.question.answer;
      return html`
        <style>
          .tile-container {
            overflow:hidden;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: 8px;
            transform-origin:0% 0%;
            transition:transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
          }
          .tile-container.hide {
            display:none;
          }
          .tile {
            box-sizing:border-box;
            position:relative;
            width:100%;
            height:100%;
            border-radius:8px;
            color:white;
            padding:8px;
            cursor:pointer;
            text-align:center;
          }
          .tile > * {
            pointer-events: none;
          }
          .tile:nth-child(5n+1) {
            background:linear-gradient(90deg, #f44336, #ff9800);
          }
          .tile:nth-child(5n+2) {
            background:linear-gradient(90deg, #ff9800, #4caf50);
          }
          .tile:nth-child(5n+3) {
            background:linear-gradient(90deg, #4caf50, #2196f3);
          }
          .tile:nth-child(5n+4) {
            background:linear-gradient(90deg, #2196f3, #9c27b0);
          }
          .tile:nth-child(5n+5) {
            background:linear-gradient(90deg, #9c27b0, #f44336);
          }
          .tile[selected] {
            border:4px solid #222;
          }
        </style>
        <h4>What line is next?</h4>
        <p>${line}</p>
        <div class="tile-container">
          ${options.map((line: string, index: number) => {
            return html`
              <div tabindex="0" class="tile" ?selected=${this.isAnswer(line)} @click=${() => {
                this.selectedAnswer = line;
                this.setAnswer(line, this.index);
              }}>
                <h4>${line}</h4>
              </div>
            `;
          })}
        </div>
      `;
    }
  }

}

@customElement('linr-add')
class LinrAdd extends LitElement {

  @property()
  acts: Array<any> = [{act:1, lines:[]}];

  @property()
  rerender: number = 0;

  @property()
  addProject: Function;

  @property()
  saveEditedProject: Function;

  @property()
  deleteProject: Function;

  @property()
  title: string = "";

  @property()
  character: string = "";

  @property({type:Boolean})
  edit: boolean = false;

  upload() {
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.linr';
    input.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => (this.addProject(JSON.parse(event.target.result)));
      reader.readAsText(file);
    });
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  render() {
    return html`
      <style>
        main {
          background-color:#fff;
          position:fixed;
          top:0px;
          left:0px;
          width:100%;
          height:100%;
          z-index:3;
          overflow:auto;
        }
        main.hide {
          display:none;
        }
      </style>
      <main class="${false ? 'hide' : 'show'}">
        <h1><gvt-button @click=${()=>{
          this.deleteProject(false);
        }}>Cancel</gvt-button>${this.edit ? 'Edit' : 'New'} Project</h1>
        ${html`<h3>Upload File</h3>
        <gvt-button @click=${() => {
          this.upload();
        }}>Upload .linr File</gvt-button>`}
        <h3>${this.edit ? 'Edit' : 'Create'} Project</h3>
        <form>
          <gvt-input type="text" value=${this.title} @input=${(event: any) => {
            this.title = event.target.value;
          }}>Title</gvt-input>
          <gvt-input type="text" value=${this.character} @input=${(event:any) => {
            this.character = event.target.value;
          }}>Character</gvt-input>
          <h4>Acts</h4>
          ${this.acts.map((item: any, index: number) => {
            return html`<linr-add-act act=${item.act} .lines=${this.edit ? this.acts[index].lines : []} .updateLines=${(lines: object) => {
              this.acts[index].lines = lines;
            }}></linr-add-act>`;
          })}
          <gvt-button @click=${() => {
            this.acts.push({act:this.acts.length+1,lines:[]});
            this.rerender++;
          }}>Add Act</gvt-button>
          <gvt-button ?disabled=${this.acts.length == 1} @click=${() => {
            this.acts.pop();
            this.rerender++;
          }}>Remove Act</gvt-button>
        </form>
        ${this.edit ? html`<gvt-button @click=${()=>{
          this.deleteProject(true);
        }}>Delete Project</gvt-button>` : ''}<br>
        <gvt-button @click=${() => {
          let project: any = {
            title: this.title,
            character: this.character,
            hidden: false,
            acts:this.acts
          };
          if (this.edit) {
            this.saveEditedProject(project);
          } else {
            this.addProject(project);
          }
        }}>${this.edit ? 'Save' : 'Create'} Project</gvt-button>
      </main>
    `;
  }
}

@customElement('linr-add-act')
class LinrAddAct extends LitElement {

  @property({type:Number})
  act: number;

  @property({type:Function})
  delete: Function;

  @property({type:Number})
  rerender: number = 0;

  @property()
  updateLines: Function;

  @property({type:Array})
  lines: any = [];

  render() {
    return html`
      <style>
        .tile-container {
          overflow:hidden;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-gap: 8px;
          transform-origin:0% 0%;
          transition:transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        .tile-container.hide {
          display:none;
        }
        .tile {
          box-sizing:border-box;
          position:relative;
          width:100%;
          height:100%;
          border-radius:8px;
          color:white;
          padding:8px;
          cursor:pointer;
        }
        .tile:focus, .tile:hover {
          z-index:1;
        }
        .tile:nth-child(5n+1) {
          background:linear-gradient(90deg, #f44336, #ff9800);
        }
        .tile:nth-child(5n+2) {
          background:linear-gradient(90deg, #ff9800, #4caf50);
        }
        .tile:nth-child(5n+3) {
          background:linear-gradient(90deg, #4caf50, #2196f3);
        }
        .tile:nth-child(5n+4) {
          background:linear-gradient(90deg, #2196f3, #9c27b0);
        }
        .tile:nth-child(5n+5) {
          background:linear-gradient(90deg, #9c27b0, #f44336);
        }
        textarea {
          width:calc(100% - 8px);
        }
      </style>
      <div>
        <h5>Act ${this.act}</h5>
        <h6>Lines</h6>
        <div class="tile-container">
          ${this.lines.map((line: any, index: number) => {
            return html`
              <div class="tile">
                <h6>Line:</h6>
                <textarea class="line" @input=${(event: any) => {
                  this.lines[index]['line'] = event.target.value;
                }}>${line.line}</textarea>
                <h6>Previous Line:</h6>
                <textarea class="previous-line" @input=${(event: any) => {
                  this.lines[index]['previousLine'] = event.target.value;
                  this.updateLines(this.lines);
                }}>${line.previousLine}</textarea>
                <gvt-button @click=${() => {
                  this.lines.splice(index, 1);
                  this.rerender++;
                }}>Delete Line</gvt-button>
              </div>
            `;
          })}
        </div>
        <gvt-button @click=${() => {
          this.lines.push({
            line:null,
            previousLine:null
          });
          this.rerender++;
        }}>Add Line</gvt-button>
      </div>
    `;
  }

}