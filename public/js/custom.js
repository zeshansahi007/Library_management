$(document).ready(function(){
    /* Urls */
    const baseUrl = 'http://localhost:3000'
    const currentUrl = window.location.href

    const path = window.location.pathname

    /* Handle Session and Redirections */
    function handleSession(){
        if(sessionStorage.user !== '') {
            $('.auth-links').show()
            return true
        }
        else {
            return false
        }
    }
    function handleRedirects(){
        if(!handleSession()) {
            if(currentUrl !== `${baseUrl}/` && currentUrl !==`${baseUrl}/`) {
                window.location.href = `${baseUrl}/`
            }
        }
        else {
            var lastIndex = currentUrl.substring(currentUrl.lastIndexOf('/') + 1)
            if(sessionStorage.type==1){
                if(currentUrl !== `${baseUrl}/${lastIndex}`) window.location.href = `${baseUrl}/${lastIndex}`
            }
        }
    }
    sessionStorage.setItem("type","1")
    handleSession()
    handleRedirects()

    /* Get Books */
    function books(){
        var apiUrl = sessionStorage.type==1 ? `${baseUrl}/allBooks` : `${baseUrl}/allBooks`
        axios.get(apiUrl).then(async (res) => {
            if(res.data.success){
                const data = res.data.rows
                sessionStorage.type==1 ? $('#userBooks').empty() : $('#adminBooks').empty()
                if(sessionStorage.type==1 ){
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
            }
        })
    }

    books()
    

    
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