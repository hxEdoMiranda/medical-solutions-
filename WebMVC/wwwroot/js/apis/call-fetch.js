const uri = `${baseUrl}/vonagecall`;

export async function generateToken() {
    try {
        let response = await fetch(`${uri}/jwt`, {
            method: 'POST'
        });
        return await response.json();
    } catch (error) {
        console.error('Unable to enter session.', error);
    }
}
