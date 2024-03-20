import {pb} from '$lib/pocketbase'

// So here we just declare the auth logic 
// Yes, when the page first loads (only first load) it runs first
// I do not remember exactly  the logic, so let me take a look at indecisive

// So here we explain what is happening ...
// This line here  on 11 simply asks the html document to read the cookie 
pb.authStore.loadFromCookie(document.cookie)

// This here tells the store (it's not a svelte store)
// to react whenever the auth state changes (authenticated/unauthenticated)
// Yes, this here just contains some info about the user
pb.authStore.onChange(() => {
    // Whenever the state changes
    // We tell it to sync it immediately (if that is how you spell it)
    // with the browsers cookie
    document.cookie = pb.authStore.exportToCookie({
        // Http only - if it is true, we cannot read it from js
        httpOnly: false,
        // This here not too sure what it does, but it's not really important in our case
        secure: false
    })
})

// This here, runs on first load only
// It basically checks if the cookie's data is a valid user info
// if it is, we request that the user has his authToken refreshed (duration)
if (pb.authStore.isValid) pb.collection('users').authRefresh()
