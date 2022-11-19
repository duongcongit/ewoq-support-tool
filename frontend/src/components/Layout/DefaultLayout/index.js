import {Container } from 'react-bootstrap';

import Footer from './Footer';

const DefaultLayout = ({ children }) => {
    return (
        <>
            <Container fluid>
                {children}
            </Container>
            <div>
                <Footer/>
            </div>
        </>
    )
}

export default DefaultLayout;