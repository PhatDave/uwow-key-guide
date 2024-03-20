import {pb} from '$lib/pocketbase'
import {user} from '$lib/stores/user'

pb.authStore.loadFromCookie(document.cookie)

pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        secure: false
    })
    // @ts-ignore
    user.set(pb.authStore.isValid ? pb.authStore.model : null)
})

if (pb.authStore.isValid) pb.collection('users').authRefresh()
