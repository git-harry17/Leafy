import { useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component"
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/usercard.component";


const SearchPage = () => {

    let { query } = useParams();

    let [blogs, setBlog] = useState(null);
    let [users, setUsers] = useState(null);

    const searchBlogs = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: query })
            .then(({ data }) => {

                setBlog(data.blogs);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
            .then(({ data: { users } }) => {

                setUsers(users);
                console.log(users);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        resetState();
        searchBlogs();
        fetchUsers();
    }, [query]);

    const resetState = () => {
        setBlog(null);
        setUsers(null);
    }

    const UserCardWrapper = () => {
        return (
            <>
                {

                    users == null ? <Loader /> :
                        users.length ? users.map((user, i) =>{ 
                           return <AnimationWrapper key={i} transition={{duration :1, delay:i*0.08}}>
                              <UserCard user={user} />
                            </AnimationWrapper>

                        })
                            : <NoDataMessage message="no user found" />
                }

            </>
        )
    }
    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation routes={[`search results from "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
                    <>
                        {
                            blogs == null ? (<Loader />)
                                : (blogs.length ? blogs.map((blog, i) => {
                                    return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>

                                        <BlogPostCard content={blog} author={blog.author.personal_info} />
                                    </AnimationWrapper>
                                })
                                    : <NoDataMessage message="no blog published " />
                                )
                        }
                    </>

                    <UserCardWrapper />
                </InPageNavigation>
            </div>
            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">

                        <h1 className="font-medium  text-xl mb-8">Users related to serach   <i className="fi fi-rr-user mt-1"></i></h1>
                        <UserCardWrapper/>
            </div>

        </section>
    )
}
export default SearchPage