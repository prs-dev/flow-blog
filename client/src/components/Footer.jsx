import { Footer } from "flowbite-react"
import { Link } from "react-router-dom"
import {BsFacebook, BsInstagram, BsGithub, BsTwitterX, BsDribbble} from 'react-icons/bs'

const FooterComp = () => {
    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-col-1">
                    <div className="my-5">
                        <Link to='/' className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
                            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Prs's</span>
                            Blog
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
                        <div>
                        <Footer.Title title='About' />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href="#"
                            >
                                Projects
                            </Footer.Link>
                            <Footer.Link
                                href="/about"
                            >
                                My blog
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>
                        <div>
                        <Footer.Title title='Follow Us' />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='https://github.com/prs-dev'
                                target="_blank"
                                rel="noopener noreferrer" //prevent blocking of new tab
                            >
                                Github
                            </Footer.Link>
                            <Footer.Link
                                href="#"
                                // target="_blank"
                                // rel="noopener noreferrer"
                            >
                                Discord
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>
                        <div>
                        <Footer.Title title='Follow Us' />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                // href='https://github.com/prs-dev'
                                // target="_blank"
                                rel="noopener noreferrer" //prevent blocking of new tab
                            >
                                Privacy Policy
                            </Footer.Link>
                            <Footer.Link
                                href="#"
                                // target="_blank"
                                // rel="noopener noreferrer"
                            >
                                Terms and Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="Prs.dev" year={new Date().getFullYear()} />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsTwitterX} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsDribbble} />
                        <Footer.Icon href="#" icon={BsGithub} />
                    </div>
                </div>
            </div>
        </Footer>
    )
}

export default FooterComp