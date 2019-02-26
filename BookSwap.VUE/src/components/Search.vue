<template>
    <div class="container">
        <div class="my-5 text-center">
            <h3>You searched for <u>{{this.$route.params.term}}</u>. Click <router-link tag="a" to="/">here</router-link> to search for another book.</h3>
        </div>

        <div class="list-group">
            <a href="#" v-for="book in books" :key="book.Id" class="list-group-item list-group-item-action" v-on:click.prevent="showBookModal(book)">
                <div class="row">
                    <div class="col-sm-2 text-center">
                        <img style="max-height:100px; max-width:100%;" class="align-self-start mr-3" :src="book.Image" :alt="book.Title">
                    </div>
                    <div class="col-sm-10">
                        <div class="d-flex w-100 mt-1 justify-content-between">
                            <h5 class="mb-1">{{book.Title}}</h5>
                            <small>{{book.Class}}</small>
                        </div>
                        <p class="mb-1">{{book.Description}}</p>
                        <small>{{book.University}}</small>
                    </div>
                </div>
            </a>
        </div>

        <div v-if="isBookModalOpen">
            <transition name="modal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">{{bookModal.Title}}</h5>
                                    <button type="button" class="close" @click="isBookModalOpen = false" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                                <div class="modal-body">
                                    <img :src="bookModal.Image" />

                                    <div class="row">
                                        <div class="col-sm-4">Description:</div>
                                        <div class="col-sm-8">{{bookModal.Description}}</div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-4">University/Class:</div>
                                        <div class="col-sm-8">{{bookModal.UniversityDisplay}}</div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-4">ISBN:</div>
                                        <div class="col-sm-8">{{bookModal.Isbn}}</div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-4">Condition:</div>
                                        <div class="col-sm-8">{{bookModal.Condition}}</div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-4">Date Posted:</div>
                                        <div class="col-sm-8">{{bookModal.DateAddedDisplay}}</div>
                                    </div>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" v-on:click="message"><i class="fa fa-comments"></i> Message</button>
                                    <button type="button" class="btn btn-secondary" @click="isBookModalOpen = false"><i class="fa fa-times"></i> Close</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import session from '../session';

    export default {
        name: 'Book',
        props: ["term"],
        data() {
            return {
                books: [],
                isBookModalOpen: false,
                bookModal: {}
            }
        },
        methods: {
            message() {
                var self = this;
                var user = session.get();

                self.$http.put("/v1/threads", { BookId: self.bookModal.Id, From: user.email }).then(() => {
                    self.isBookModalOpen = false;

                    self.$notify("Successfully sent message to the book owner.");
                });
            },
            showBookModal(book) {
                var self = this;

                self.$http.get("/v1/books/" + book.Id).then((response) => {
                    self.bookModal = response.data;
                });

                self.isBookModalOpen = true;
            }
        },
        mounted() {
            var term = this.$route.params.term;
            var self = this;

            this.$http.post("/v1/search", { query: term }).then((response) => {
                self.books = response.data;
            });
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
