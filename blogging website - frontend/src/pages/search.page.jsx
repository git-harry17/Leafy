import { useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component"
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import {useState} from "react";


const SearchPage = () => {

    let { query } = useParams();

    let [blogs, setBlog]=useState(null);

    const searchBlogs=()=>
    {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {query})
        .then(({ data }) => {
                setBlog(data.blogs);
            })
            .catch(err => {
                console.log(err);
            })
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
                </InPageNavigation>
            </div>

        </section>
    )
}
export default SearchPage