import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTab } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
const HomePage = () => {

    let [blogs, setBlog] = useState(null);
    let [trendingBlogs, setTrendingBlog] = useState(null);
    let [pageState, setPageState] = useState("home");

    let categories = ["programming", "Books", "Cooking", "Productive", "Finances", "tech", "Govt", "motivational" , "Education"];
    const fetchLatestBlogs = () => {


        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
            .then(({ data }) => {
                setBlog(data.blogs);
            })
            .catch(err => {
                console.log(err);
            })
    }
    const fetchTrendingBlogs = () => {


        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
            .then(({ data }) => {
               setTrendingBlog(data.blogs);
            })
            .catch(err => {
                console.log(err);
            })
    }
    const fatchBlogsByCategory = () => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState })
            .then(({ data }) => {
                setBlog(data.blogs);
            })
            .catch(err => {
                console.log(err);
            })
    }
    useEffect(() => {

        activeTab.current.click();
        if (pageState == "home") {
            fetchLatestBlogs();
        }
        else {
            fatchBlogsByCategory();
        }
        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }

    }, [pageState])

    const loadByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        
        setBlog(null);

        if (pageState == category) {
            setPageState("home");
            return;
        }

        setPageState(category);
    }

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                <div className="w-full">
                    <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>
                        <>
                            {
                                blogs == null ?(<Loader />)
                                    : (blogs.length ? blogs.map((blog, i) => {
                                        return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>

                                            <BlogPostCard content={blog} author={blog.author.personal_info} />
                                        </AnimationWrapper>
                                    })
                                    :<NoDataMessage message="no blog published " />
                                )
                            }
                        </>


                        {
                            trendingBlogs == null ?( <Loader />)
                                :(
                                    trendingBlogs.length ? trendingBlogs.map((blog, i) => {
                                    return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>

                                        <MinimalBlogPost blog={blog} index={i} />
                                    </AnimationWrapper>
                                }) : <NoDataMessage message="no trending blog"/>

                                ) 
                        }

                    </InPageNavigation>
                </div>
                {/*filter and trending blogs */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l  border-grey pl-8 pt-3 max-md:hidden ">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">Stories from all interests</h1>

                            <div className="flex gap-3 flex-wrap">
                                {
                                    categories.map((category, i) => {
                                        let categoryKey = category.toLowerCase();
                                        return <button
                                            onClick={loadByCategory} className={"tag " + (pageState == categoryKey ? " bg-black text-white " : " ")} key={i}
                                        >
                                            {category}
                                        </button>
                                    })
                                }
                            </div>


                        </div>

                        <div>

                            <h1 className="font-medium text-xl">Trending<i className="fi fi-bs-arrow-trend-up"></i></h1>
                            {
                                trendingBlogs == null ? (<Loader />)
                                    : (trendingBlogs.length  ? trendingBlogs.map((blog, i) => {
                                        return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>

                                            <MinimalBlogPost blog={blog} index={i} />
                                        </AnimationWrapper>
                                    })
                                    :
                                    <NoDataMessage message="no trending blogs"/>
                                )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    );
}

export default HomePage;