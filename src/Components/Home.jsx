 import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import Swal from 'sweetalert2';
import './Home.scss'

function Home() {
    let baseURL = 'https://route-egypt-api.herokuapp.com/';
    let token = localStorage.getItem('userToken');
    let userDecoded = jwt_decode(token);
    let userID = userDecoded._id;


    const [notes, setNotes] = useState([]);
    const [note, setNote] = useState({ 'title': '', 'desc': '', userID, token });
    const [loading, setLoding] = useState(false);



    async function getUserNotes() {
        let { data } = await axios.get(baseURL + "getUserNotes", {
            headers: {
                userID,
                Token: token
            }
        })
        if (data.message == 'success') {
            setNotes(data.Notes)

        }
        // console.log(notes);
    }

    useEffect(() => {
        getUserNotes()
    }, [])

    function getNote({ target }) {
        setNote({ ...note, [target.name]: target.value })
    }

    // console.log(note);


    async function addNote(e) {
        e.preventDefault();
        setLoding(true);
        let { data } = await axios.post(baseURL + 'addNote', note)
        // console.log(data);

        if (data.message == 'success') {
            document.getElementById('add-form').reset()
            getUserNotes();
            Swal.fire(
                'Added',
                'Your note has been added.',
                'success'
            )
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        }
        setLoding(false);
    }

    function deleteNote(NoteID) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(baseURL + 'deleteNote', {
                    data: {
                        NoteID,
                        token
                    }
                }).then((response) => {
                    // console.log(response);
                    if (response.data.message == 'deleted') {
                        getUserNotes();
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message,
                        })
                    }
                })
            }
        })

        // console.log(data);


    }

    function getNoteID(NoteIndex) {
        // console.log(notes[NoteIndex]);
        document.querySelector("#exampleModal1 input").value = notes[NoteIndex].title
        document.querySelector("#exampleModal1 textarea").value = notes[NoteIndex].desc

        setNote({ ...note, 'title': notes[NoteIndex].title, "desc": notes[NoteIndex].desc, NoteID: notes[NoteIndex]._id })
    }

    async function updateNote(e) {
        e.preventDefault();
        // console.log(note);
        let { data } = await axios.put(baseURL + 'updateNote', note)
        // console.log(data);
        if (data.message == 'updated') {
            getUserNotes();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your update has been saved',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    return (
        <>
            <div className="home">
                <div className="container my-5">
                    <div className="col-md-12 text-end">
                        <a className="add p-2 btn" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-plus-circle"></i> Add
                            New</a>
                    </div>
                </div>

                {/* <!-- Add Modal --> */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <form id="add-form" onSubmit={addNote}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                                    <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button data-bs-dismiss="modal" type="submit" className="btn btn-info"><i className="fas fa-plus-circle"></i> Add Note</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* <!-- Edit Modal --> */}
                <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <form onSubmit={updateNote} id="edit-form">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                                    <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-dismiss="modal">Close</button>
                                    <button data-bs-dismiss="modal" type="submit" className="btn btn-info">Update Note</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* <!-- ==========================Notes=============================== --> */}

                {loading === true ?

                    <div className='d-flex justify-content-center align-items-center vh-100'>
                        <i className='fas fa-spinner fa-spin fa-4x'></i>
                    </div>
                    :
                    <div className="container">
                        <div className="row">
                            {notes.map((note, index) => {
                                return (
                                    <div key={index} className="col-md-4 my-4">
                                        <div className="note p-5 bg-dark shadow-lg rounded-3">
                                            <div className="title d-flex flex-wrap justify-content-between align-items-baseline my-3">
                                                <h3 className="text-primary">{note.title}</h3>
                                                <div className="option">
                                                    <a onClick={() => { deleteNote(note._id) }} > <i className="fas fa-trash-alt  px-3 del"></i></a>
                                                    <a onClick={() => { getNoteID(index) }} data-bs-toggle="modal" data-bs-target="#exampleModal1" ><i className="fas fa-edit edit"></i></a>
                                                </div>
                                            </div>
                                            {/* <div className="clearfix"></div> */}
                                            <p className='text-muted'>{note.desc}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }

            </div>


        </>
    )
}

export default Home
