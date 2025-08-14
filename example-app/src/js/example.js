import { CapHog } from '@caphog/sdk';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    CapHog.echo({ value: inputValue })
}
