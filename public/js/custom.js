$(document).ready(function(){
    /* Urls */
    const baseUrl = 'http://localhost:3000'
    const currentUrl = window.location.href

    const path = window.location.pathname

    /* Handle Session and Redirections */
    function handleSession(){
        if(sessionStorage.user !== '') {
            $('#logout').show()
            $('#login').hide()
            $('#signup').hide()
            $('.auth-links').show()
            return true
        }
        else {
            $('#logout').hide()
            $('#login').show()
            $('#signup').show()
            $('.auth-links').hide()
            return false
        }
    }
    function handleRedirects(){
        if(!handleSession()) {
            if(currentUrl !== `${baseUrl}/`) {
                if(currentUrl != `${baseUrl}/signup`) window.location.href = `${baseUrl}/`
                
            }
        }
        else {
            var lastIndex = currentUrl.substring(currentUrl.lastIndexOf('/') + 1)
            if(sessionStorage.type==1){
                if(currentUrl !== `${baseUrl}/${lastIndex}`) window.location.href = `${baseUrl}/${lastIndex}`
            }
            else{
                if(currentUrl !== `${baseUrl}/admin/${lastIndex}`) window.location.href = `${baseUrl}/admin/${lastIndex}`
            }
        }
    }
    handleSession()
    handleRedirects()

    /* Notify Function */
    function alert(type,message){
        $('.alert').removeClass('alert-danger')
        $('.alert').removeClass('alert-success')
        $('.alert').show()
        if(type=='error') $('.alert').toggleClass('alert-danger')
        if(type=='success') $('.alert').toggleClass('alert-success')
        $('.alert').text(message)
    }

    /* Sign Up */
    $('#signupBtn').click(function(e){
        e.preventDefault()
        var data = {
            email: $('#email').val(),
            username: $('#username').val(),
            password: $('#password').val()
        }
        axios.post(`${baseUrl}/signup`,data).then(res => {
            if(res.data.success){
                alert('success',res.data.message)
                handleRedirects()
            }
            else alert('error',res.data.message)
        })
    })

    /* Login */
    $('#loginBtn').click(function(e){
        e.preventDefault()
        var data = {
            email: $('#loginemail').val(),
            password: $('#loginpassword').val()
        }
        axios.post(`${baseUrl}/login`,data).then(res => {
            if(res.data.success){
                alert('success',res.data.message)
                sessionStorage.user = data.email
                sessionStorage.id = res.data.id
                sessionStorage.type = res.data.type
                window.location.href = `${baseUrl}/books`
            }
            else alert('error',res.data.message)
        })
    })

    /* Logout */
    $('#logout').click(function(e){
        e.preventDefault()
        sessionStorage.user = ''
        sessionStorage.type = ''
        sessionStorage.id = ''
        handleRedirects()
    })

    /* Get Books */
    function books(){
        let borrowed = false
        var apiUrl = sessionStorage.type==1 ? `${baseUrl}/allBooks` : `${baseUrl}/admin/allBooks`
        currentUrl==`${baseUrl}/borrowed` ? borrowed=true : borrowed=false
        axios.get(apiUrl).then(async (res) => {
            if(res.data.success){
                const data = res.data.rows
                sessionStorage.type==1 ? $('#userBooks').empty() : $('#adminBooks').empty()
                if(sessionStorage.type==1 ){
                    if(!borrowed){
                        for (let index = 0; index < data.length; index++) {
                                var str = ``
                                str = `<tr data-id="${data[index]['book_id']}">
                                            <td>${data[index]['book_id']}</td>
                                            <td>${data[index]['book_name']}</td>
                                            <td>${data[index]['author_name']}</td>
                                            <td>${date(data[index]['publish_date'])}</td>
                                            <td>${data[index]['day_rent']}</td>
                                        `
                                await axios.get(`${baseUrl}/booksAvailable/${data[index]['book_id']}/${sessionStorage.id}`).then(ress => {
                                    if(ress.data.success){
                                        if(!ress.data.available && !ress.data.already) str = `${str}<td><a href="#0" class="btn btn-danger">Not Available</a></td>`
                                        else if(ress.data.already && !ress.data.available){
                                            str = `${str}
                                                <td>
                                                    <a href="#0" data-bs-toggle="modal" data-bs-target="#returnBookModal" data-id="${ress.data.row[0]['detials_id']}" data-total="${ress.data.row[0]['total_bill']}"  data-borrow_date="${ress.data.row[0]['borrow_date']}" data-return_date="${ress.data.row[0]['return_date']}" data-price="${data[index]['day_rent']}" class="btn btn-light returnBook"><i class="fa fa-share"></i></a>
                                                </td>`
                                        }
                                        else if(ress.data.available && !ress.data.already){
                                            str = `${str}
                                                <td>
                                                    <a href="#0" class="btn btn-light borrowBook" data-bs-toggle="modal" data-bs-target="#borrowBookModal" data-id="${data[index]['book_id']}" data-price="${data[index]['day_rent']}"><i class="fa fa-shopping-cart"></i></a>
                                                </td>`
                                        }
                                        else {str = `${str}<td><a href="#0" class="btn btn-danger">Not Available</a></td>`}
                                    }
                                    else {str = `${str}<td><a href="#0" class="btn btn-danger">Not Available</a></td>`}
                                })
                                $('#userBooks').append(`${str}</tr>`)
                        }
                    }
                    else{
                        for (let index = 0; index < data.length; index++) {
                            axios.get(`${baseUrl}/booksAvailable/${data[index]['book_id']}/${sessionStorage.id}`).then(ress => {
                                if(ress.data.success){
                                    if(ress.data.already){
                                        var str = ``
                                        str = `<tr 
                                            data-id="${data[index]['book_id']}">
                                            <td>${data[index]['book_id']}</td>
                                            <td>${data[index]['book_name']}</td>
                                            <td>${data[index]['author_name']}</td>
                                            <td>${date(data[index]['publish_date'])}</td>
                                            <td>${data[index]['day_rent']}</td>
                                        `
                                        if(!ress.data.available && !ress.data.already) str = `${str}<td><a href="#0" class="btn btn-danger">Not Available</a></td><tr>`
                                        else if(ress.data.already && !ress.data.available){
                                            str = `${str}
                                                <td>
                                                    <a href="#0" data-bs-toggle="modal" data-bs-target="#returnBookModal" data-id="${ress.data.row[0]['detials_id']}" data-total="${ress.data.row[0]['total_bill']}"  data-borrow_date="${ress.data.row[0]['borrow_date']}" data-return_date="${ress.data.row[0]['return_date']}" data-price="${data[index]['day_rent']}" class="btn btn-light returnBook"><i class="fa fa-share"></i></a>
                                                </td>
                                            </tr>`
                                        }
                                        else if(ress.data.available && !ress.data.already){
                                            str = `${str}
                                                <td>
                                                    <a href="#0" class="btn btn-light borrowBook" data-bs-toggle="modal" data-bs-target="#borrowBookModal" data-id="${data[index]['book_id']}" data-price="${data[index]['day_rent']}"><i class="fa fa-shopping-cart"></i></a>
                                                </td>
                                            </tr>`
                                        }
                                        else str = `${str}<td><a href="#0" class="btn btn-danger">Not Available</a></td><tr>`
                                    }
                                }
                                else str = `${str}<td><a href="#0" class="btn btn-danger">Not Available</a></td><tr>`
                                $('#userBooks').append(str)
                            })
                        }
                    }
                }
                else{
                    for (let index = 0; index < data.length; index++) {
                        $('#adminBooks').append(`
                            <tr 
                                data-id="${data[index]['book_id']}" 
                                data-title="${data[index]['book_name']}"
                                data-stock="${data[index]['stock']}"
                                data-author="${data[index]['author_name']}"
                                data-publish="${date(data[index]['publish_date'])}"
                                data-rent="${data[index]['day_rent']}">
                                <td>${data[index]['book_id']}</td>
                                <td>${data[index]['book_name']}</td>
                                <td>${data[index]['stock']}</td>
                                <td>${data[index]['author_name']}</td>
                                <td>${date(data[index]['publish_date'])}</td>
                                <td>${data[index]['day_rent']}</td>
                                <td>
                                    <a href="#0" class="btn btn-light edit-btn" data-bs-toggle="modal" data-bs-target="#editBookModal"><i class="fa fa-edit"></i></a>
                                    <a href="#0" class="btn btn-danger delete-btn"><i class="fa fa-trash"></i></a>
                                </td>
                            </tr>
                        `)
                    }
                }
            }
        })
    }

    books()
    

    /* Borrow Book */
    $('body').delegate('.borrowBook','click',function(){
        var now = new Date()
        var day = ("0" + now.getDate()).slice(-2)
        var month = ("0" + (now.getMonth() + 1)).slice(-2)
        var today = now.getFullYear()+"-"+(month)+"-"+(day)

        $('#borrowbookId').val($(this).data('id'))
        $('#borrow_date').val(today)
        $('#rentPerDay').val($(this).data('price'))
        
    })

    $('#borrowBookBtn').click(function(){
        var start = $('#borrow_date').val()
        var end = $('#return_date').val()
        var rent = $('#rentPerDay').val()
        var days = daysdifference(start,end)
        days = days==0 ? days = 1 : days
        total_bill = days * rent
        var data = {
            borrow_date : start,
            return_date : end,
            total_bill : total_bill,
            user_id : sessionStorage.id,
            book_id: $('#borrowbookId').val()
        }
        axios.post(`${baseUrl}/booksBorrow/`,data).then(res => {
            if(res.data.success){
                books()
                $('.closeModal').click()
                alert('success',res.data.message)
            }
            else alert('error',res.data.message)
        })
    })

    $('body').delegate('.returnBook','click',function(){
        var now = new Date()
        var day = ("0" + now.getDate()).slice(-2)
        var month = ("0" + (now.getMonth() + 1)).slice(-2)
        var today = now.getFullYear()+"-"+(month)+"-"+(day)

        var end = $(this).data('return_date')
        var rentPerDay = $(this).data('price')
        var fine = 0
        if(today > end){
            fine = daysdifference(today,end) * rentPerDay
        }
        $('#rDate').val(date($(this).data('return_date')))
        $('#bDate').val(date($(this).data('borrow_date')))
        $("#returnbookId").val($(this).data('id'))
        $("#totalFine").val(fine)
        $("#totalCharges").val($(this).data('total'))
        
    })

    $('#returnBookBtn').click(function(){
        var data = {
            id : $("#returnbookId").val(),
            totalFine : $("#totalFine").val(),
            totalCharges : $("#totalCharges").val(),
            user_id : sessionStorage.id
        }
        axios.post(`${baseUrl}/booksReturn/`,data).then(res => {
            if(res.data.success){
                books()
                $('.closeModal').click()
                alert('success',res.data.message)
            }
            else alert('error',res.data.message)
        })
    })

    const daysdifference = (firstDate, secondDate) => {  
        var startDay = new Date(firstDate);  
        var endDay = new Date(secondDate);  
        // Determine the time difference between two dates     
        var millisBetween = startDay.getTime() - endDay.getTime();  
        // Determine the number of days between two dates  
        var days = millisBetween / (1000 * 3600 * 24);  
        // Show the final number of days between dates     
        return Math.round(Math.abs(days));  
    }  

    /* Add Book */
    $('#addBookBtn').click(function(){
        var data = {
            title: $('#title').val(),
            stock: $('#stock').val(),
            author: $('#author').val(),
            publish: $('#publish').val(),
            rent: $('#rent').val()
        }
        axios.post(`${baseUrl}/admin/addBooks`,data).then(res => {
            if(res.data.success){
                books()
                $('#title').val('')
                $('#stock').val('')
                $('#author').val('')
                $('#publish').val('')
                $('#rent').val('')
                $('.closeModal').click()
                alert('success',res.data.message)
            }
            else alert('error',res.data.message)
        })
    })

    /* Edit Book */
    $('body').delegate('.edit-btn','click',function(){
        $('#bookId').val($(this).parent().parent().data('id'))
        $('#titleEdit').val($(this).parent().parent().data('title'))
        $('#stockEdit').val($(this).parent().parent().data('stock'))
        $('#authorEdit').val($(this).parent().parent().data('author'))
        $('#rentEdit').val($(this).parent().parent().data('rent'))
    })

    /* Update Book */
    $('#updateBookBtn').click(function(){
        var data = {
            id: $('#bookId').val(),
            title: $('#titleEdit').val(),
            stock: $('#stockEdit').val(),
            author: $('#authorEdit').val(),
            rent: $('#rentEdit').val()
        }
        axios.post(`${baseUrl}/admin/updateBooks`,data).then(res => {
            if(res.data.success){
                books()
                $('.closeModal').click()
                alert('success',res.data.message)
            }
            else alert('error',res.data.message)
        })
    })

     /* Delete Book */
     $('body').delegate('.delete-btn','click',function(){
        var id = $(this).parent().parent().data('id')
        axios.get(`${baseUrl}/admin/deleteBook/${id}`).then(res => {
            if(res.data.success){
                books()
                alert('success',res.data.message)
            }
            else alert('error',res.data.message)
        })
    })

    /* -------------- Users -------------- */

    /* Get Books */
    function users(){
        axios.get(`${baseUrl}/admin/allUsers`).then(res => {
            if(res.data.success){
                const data = res.data.rows
                $('#adminUsers').empty()
                for (let index = 0; index < data.length; index++) {
                    $('#adminUsers').append(`
                        <tr 
                            data-id="${data[index]['user_id']}" 
                            data-username="${data[index]['user_name']}"
                            data-password="${data[index]['password']}">
                            <td>${data[index]['user_id']}</td>
                            <td>${data[index]['user_name']}</td>
                            <td>${data[index]['email']}</td>
                            <td>
                                <a href="#0" class="btn btn-light editUserBtn" data-bs-toggle="modal" data-bs-target="#editUser"><i class="fa fa-edit"></i></a>
                                <a href="#0" class="btn btn-danger deleteUserBtn"><i class="fa fa-trash"></i></a>
                            </td>
                        </tr>
                    `)
                }
            }
        })
    }

    users()

    /* Edit User */
    $('body').delegate('.editUserBtn','click',function(){
        $('#userId').val($(this).parent().parent().data('id'))
        $('#usernameEdit').val($(this).parent().parent().data('username'))
        $('#passwordEdit').val($(this).parent().parent().data('password'))
    })

    /* Update User */
    $('#updateUserBtn').click(function(){
        var data = {
            id: $('#userId').val(),
            username: $('#usernameEdit').val(),
            password: $('#passwordEdit').val()
        }
        axios.post(`${baseUrl}/admin/updateUser`,data).then(res => {
            if(res.data.success){
                users()
                $('.closeModal').click()
                alert('success',res.data.message)
            }
            else alert('error',res.data.message)
        })
    })

     /* Delete User */
     $('body').delegate('.deleteUserBtn','click',function(){
        var id = $(this).parent().parent().data('id')
        axios.get(`${baseUrl}/admin/deleteUser/${id}`).then(res => {
            if(res.data.success){
                users()
                alert('success',res.data.message)
            }
            else alert('error',res.data.message)
        })
    })

    /* -------------- End Users -------------- */

    /* Formate date */
    const date = (dateObject) =>  {
        var d = new Date(dateObject);
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        var date = day + "/" + month + "/" + year;
    
        return date;
    }
})