<template>
    <div class="container-fluid">
        <div class="card mt-3">
            <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs">
                    <li class="nav-item"><a v-bind:class="{ active: ActiveTab == 'library' }" v-on:click.prevent="tabChange('library')" class="nav-link" data-toggle="tab" href="#library" role="tab">Library</a> </li>
                    <li class="nav-item"><a v-bind:class="{ active: ActiveTab == 'message' }" v-on:click.prevent="tabChange('message')" class="nav-link" data-toggle="tab" href="#messages" role="tab">Messages</a> </li>
                    <!--<li class="nav-item"><a v-bind:class="{ active: ActiveTab == 'editprofile' }" v-on:click.prevent="tabChange('editprofile')" class="nav-link" data-toggle="tab" href="#editprofile" role="tab">Edit Profile</a> </li>-->
                </ul>
            </div>

            <div class="card-body tab-content">
                <div class="tab-pane fade" v-bind:class="{ 'active': ActiveTab == 'library', 'show': ActiveTab == 'library' }" id="library" role="tabpanel" aria-labelledby="nav-home-tab">
                    <div class="row mb-4 pb-3 border-bottom" v-for="(book, index) in Books" :key="book.Id">
                        <div class="col-sm-4 col-md-3 col-lg-2">
                            <img :src="book.Image" :alt="book.Title" class="img-fluid" style="max-height:150px;">
                        </div>
                        <div class="col-sm-8">
                            <h5 class="card-title">{{book.Title}}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">{{book.Isbn}}</h6>
                            <p class="card-text">{{book.Description}}.</p>
                            <router-link class="card-link" tag="a" :to="{ name: 'editpost', params: { id: book.Id }}">Edit</router-link>
                            <a href="#" v-on:click.prevent="deleteBook(book, index)" class="card-link">Delete</a>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" v-bind:class="{ 'active': ActiveTab == 'message', 'show': ActiveTab == 'message' }"  id="messages" role="tabpanel" aria-labelledby="nav-profile-tab">
                    <div class="messaging">
                        <div class="inbox_msg">
                            <div class="inbox_people">
                                <div class="headind_srch">
                                    <div class="recent_heading">
                                        <h4>Recent</h4>
                                    </div>
                                    <div class="srch_bar">
                                        <div class="stylish-input-group">
                                            <input type="text" class="search-bar" placeholder="Search">
                                            <span class="input-group-addon">
                                                <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="inbox_chat">
                                    <div class="chat_list" v-bind:class="{ active_chat: thread == ActiveThread }" v-for="thread in Threads" :key="thread.Id" v-on:click="threadClick(thread)">
                                        <div class="chat_people">
                                            <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                                            <div class="chat_ib">
                                                <h5>{{thread.Title}} <span class="chat_date">{{thread.DateAddedDisplay}}</span></h5>
                                                <p>{{thread.BookTitle}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mesgs">
                                <div class="msg_history" ref="msg_history" v-chat-scroll>
                                    <div v-bind:class="{ incoming_msg: message.SentBy == 'From', outgoing_msg: message.SentBy == 'To' }" v-for="message in Messages" v-bind:key="message.Id">
                                        <div v-bind:class="{ received_msg: message.SentBy == 'From', sent_msg: message.SentBy == 'To' }">
                                            <span class="time_date">{{message.To}} says:</span>
                                            <p>{{message.Text}}</p>
                                            <span class="time_date">{{message.DateAddedDisplay}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="type_msg">
                                    <div class="input_msg_write">
                                        <input v-model="NewMessage" type="text" class="write_msg" placeholder="Type a message" />
                                        <button v-on:click="send" class="msg_send_btn" type="button"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--<div class="tab-pane fade" v-bind:class="{ 'active': ActiveTab == 'editprofile', 'show': ActiveTab == 'editprofile' }" id="editprofile" role="tabpanel" aria-labelledby="nav-home-tab">
                    <form v-on:submit.prevent="updateProfile">
                        <div class="form-group">
                            <label>First Name</label>
                            <input type="text" v-model="User.firstname" class="form-control" required autofocus>
                        </div>

                        <div class="form-group">
                            <label>Last Name</label>
                            <input type="text" v-model="User.lastname" class="form-control" required autofocus>
                        </div>

                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" class="form-control" v-model="User.email" required>
                        </div>

                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" v-model="User.password" class="form-control" required>
                        </div>

                        <button class="btn btn-lg btn-primary ml-auto" type="submit">Update</button>
                    </form>
                </div>-->
            </div>
        </div>
    </div>
</template>

<script>
    import session from '../session';
    import firebase from 'firebase';

    export default {
        data() {
            return {
                Books: [],
                ActiveTab: "library",
                Threads: [],
                Messages: [],
                ActiveThread: {},
                NewMessage: "",
                User: {},
                timer: null
            }
        },
        methods: {
            updateProfile() {
                var self = this;
                var user = firebase.auth().currentUser;

                user.updateProfile({
                        firstname: self.User.firstname,
                        lastname: self.User.lastname,
                        photoURL: self.User.filePicker
                    })
                    .then(function () {
                        
                    })
                    .catch(function (error) {
                        self.error = error.message;
                    });
            },
            deleteBook(book, index) {
                var self = this;

                self.$http.delete("/v1/books/" + book.Id).then(() => {
                    self.Books.splice(index, 1);

                    self.$notify("Successfully deleted book.");
                });
            },
            tabChange(tab) {
                this.ActiveTab = tab;
            },
            send() {
                var self = this;
                var sess = session.get();
                var sentBy = sess.email == self.ActiveThread.From ? "From" : "To";

                self.$http.post("/v1/messages", {
                    Text: self.NewMessage,
                    ThreadId: self.ActiveThread.Id,
                    SentBy: sentBy
                }).then((response) => {
                    self.Messages.push(response.data);
                    self.NewMessage = "";
                });
            },
            threadClick(thread) {
                var self = this;

                self.ActiveThread = thread;

                self.$http.get("/v1/messages?threadId=" + thread.Id).then((response) => {
                    self.Messages = response.data;
                });
            }
        },
        mounted() {
            var self = this;
            var user = session.get();

            var fuser = firebase.auth().currentUser;

            if (fuser != null) {
                this.User.name = fuser.displayName;
                this.User.email = fuser.email;
                this.User.photoUrl = fuser.photoURL;
                this.User.emailVerified = fuser.emailVerified;
                this.User.uid = fuser.uid;
            }

            self.$http.get("/v1/books?user=" + user.email).then((response) => {
                self.Books = response.data;
            });

            self.$http.get("/v1/threads?user=" + user.email).then((response) => {
                self.Threads = response.data;
            });

            self.timer = setInterval(function () {
                if (self.ActiveThread.Id == null) {
                    return;
                }
                
                self.$http.get("/v1/messages?threadId=" + self.ActiveThread.Id).then((response) => {
                    if (self.Messages.length != response.data.length) {
                        self.Messages = response.data;
                    }
                })
                
            }, 10000);
        },
        beforeDestroy () {
            clearInterval(this.timer);
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
