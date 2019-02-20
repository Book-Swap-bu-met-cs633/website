<template>
    <div class="home">
        <div class="poster-container">
            <div class="poster-overlay"></div>
            <div class="poster-search-container">
                <h1>Find your Next Book</h1>
                <p>Type a title or ISBN</p>
                <div class="poster-search">
                    <form v-on:submit.prevent="search">
                        <div class="input-group">
                            <i class="fa fa-search"></i>
                            <input type="text" v-model="term" placeholder="Enter a keyword..." class="form-control form-control-lg">
                            <div class="input-group-append">
                                <button class="btn-poster-search btn btn-primary" type="submit">Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="container-fluid">
            <div v-masonry transition-duration="0.5s" item-selector=".card" gutter="20" fit-width="false" class="mx-auto">
                <div v-masonry-tile class="card book" v-for="book in books" :key="book.Id" style="width: 20rem;" v-on:click="viewBook(book)">
                    <img :src="book.Image" class="card-img-top" :alt="book.Title">
                    <div class="card-body">
                        <h5 class="card-title">{{book.Title}}</h5>
                        <p class="my-0 text-muted"><small><i class="fa fa-book"></i> {{book.Isbn}}</small></p>
                        <p class="my-0 text-muted"><small><i class="fa fa-building"></i> {{book.UniversityDisplay}}</small></p>
                    </div>
                    <div class="card-footer text-muted">
                        <small><i class="fa fa-calendar"></i> {{book.DaysAgo}}</small>
                    </div>
                </div>
            </div>
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
        name: 'Home',
        data() {
            return {
                books: [],
                term: "",
                isBookModalOpen: false,
                bookModal: {}
            }
        },
        methods: {
            search() {
                this.$router.push({ name: 'search', params: { term: this.term } });
            },
            viewBook(book) {
                var self = this;

                self.$http.get("/v1/books/" + book.Id).then((response) => {
                    self.bookModal = response.data;
                });

                self.isBookModalOpen = true;
            },
            message() {
                var self = this;
                var user = session.get();

                self.$http.put("/v1/threads", { BookId: self.bookModal.Id, From: user.email }).then(() => {
                    self.isBookModalOpen = false;
                });
            }
        },
        mounted() {
            var self = this;

            self.$http.get("v1/books").then((response) => {
                self.books = response.data;
            });
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
