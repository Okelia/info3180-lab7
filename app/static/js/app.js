/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const uploadForm= {
    name: 'UploadForm',
    template:`
    <div class="jumbotron">
        <h1>Upload Form </h1>
        <div class= displaymess>
            <ul>
                <li v-for="message in messages">{{message}}</li>
            </ul>
        </div>
        <form method="POST" enctype="multipart/form-data" @submit.prevent="uploadPhoto" id="uploadForm">
            <div class="lead">
                <div>
                    <label> Description </label>
                    <textarea name="description" class="form-control"></textarea>
                    <label> Photo </label>
                    <input type="file" name="photo" class="form-control">
                </div>

                <div class=bt>
                    <button class="btn-primary mb2" @click="uploadPhoto">Upload</button>
                </div>
            </div>
        </form>
    </div>
    `,

    data(){
        return {
            messages:[],
            className:''
        }
    },
    methods:{
        uploadPhoto(){
            let self=this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch("/api/upload", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                     },
                     credentials: 'same-origin'
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                    if (jsonResponse['payload']){
                        self.messages = [jsonResponse['payload']['message']];
                        self.className="uploadinfo"
                    } else {
                        self.messages = jsonResponse['upload_errors']['errors'];
                        self.className="upload_errors"
                    }
                // display a success message
                //console.log(jsonResponse);
                })
                .catch(function (error) {
                console.log(error);
                });     
    
        }
    }
}

const app = Vue.createApp({
    data() {
        return {

        }
    },
    component:{
        'uploadForm': uploadForm
    }
});


app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link to="/upload" class="nav-link">Upload Form</router-link>
          </li> 
        </ul>
      </div>
    </nav>
    `
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
    `,
    data() {
        return {}
    }
};

const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    { path: "/upload", component: uploadForm },
    // Put other routes here

    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');