import Navigation from '../components/Navigation';

const Home = () => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    return (
        <>
            <Navigation />
            {!userId && (
                <>
                    <h1 style={welcome}>WELCOME HUNTER'S</h1>
                    <h2 style={log}>Log in to save your scores</h2>
                </>
            )}
            {userId && (
                <>
                    <h1 style={welcome}>HELLO {userName}</h1>
                </>
            )}
        </>
    );
};
const welcome = {
    color: 'black',
    textAlign: 'center',
    marginTop: '20vh',
    WebkitTextStroke: '3px white',
    fontSize: '5rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
}
const log = {
    color: 'black',
    textAlign: 'center',
    WebkitTextStroke: '2px white',
    fontSize: '3rem',
    fontWeight: 'bold',
}

export default Home;