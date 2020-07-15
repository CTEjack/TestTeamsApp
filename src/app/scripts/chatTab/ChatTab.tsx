import * as React from "react";
import { Provider, Flex, Text, Button, Header, Loader } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
/**
 * State for the chatTabTab React component
 */
export interface IChatTabState extends ITeamsBaseComponentState {
    entityId?: string;
    loading: boolean;
    machineId: GUID;
    time: Date;
    voltage: number;
    temperature: number;
    light: number;
}
type GUID = string & { isGuid: true};
function guid(guid: string) : GUID {
    return  guid as GUID; // maybe add validation that the parameter is an actual guid ?
}

// export default class FetchSensorData extends React.Component {
//     state = {
//         loading: true
//     }
// }

/**
 * Properties for the chatTabTab React component
 */
export interface IChatTabProps {


}

/**
 * Implementation of the Chat content page
 */
export class ChatTab extends TeamsBaseComponent<IChatTabProps, IChatTabState> {


    public async componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));


        if (await this.inTeams()) {
            microsoftTeams.initialize();
            microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
            microsoftTeams.getContext((context) => {
                microsoftTeams.appInitialization.notifySuccess();
                this.setState({
                    entityId: context.entityId
                });
                this.updateTheme(context.theme);
            });
        } else {
            this.setState({
                entityId: "This is not hosted in Microsoft Teams"
            });
        }

    }

    //  JACK: attempting to fetch api data and display it in the console
    // Tutorial:   https://www.youtube.com/watch?time_continue=76&v=T3Px88x_PsA&feature=emb_logo
    // I needed to add a proxy URL to get around a CORS fetch error. Append this to the front of a URL to get around the error https://cors-anywhere.herokuapp.com/
    public async componentDidMount() {
        const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/";
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const response = await fetch(proxy + url);
        const data = await response.json();
        this.setState({ 
            machineId: data.machineId, 
            time: data.time, 
            voltage: data.voltage, 
            temperature: data.temperature, 
            light: data.light,
            loading: false 
        });
    }

    // -------------different method to fetch the JSON data-------------
    // componentDidMount(){
    //     const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/";
    //     const proxy = "https://cors-anywhere.herokuapp.com/";
    //     fetch(proxy + url)
    //     .then( response => response.json())
    //     .then(
    //         // handle the result
    //         (result) => {
    //             this.setState({
    //                 sensor : result
    //             });
    //         }
    //     )
    // }


    /**
     * The render() method to create the UI of the tab
     */
    public render() {
        return (<Provider theme={this.state.theme}>
                <Flex fill={true} column styles={{
                    padding: ".8rem 0 .8rem .5rem"
                }}>
                    <Flex.Item>
                        <Header content="This is your tab" />
                    </Flex.Item>
                    <Flex.Item>
                        <div>

                            <div>
                                <Text content={this.state.entityId} />
                            </div>

                            <div>
                                {this.state.loading || !this.state.voltage ? 
                                    <Loader label="Fetching voltage data..."/> 
                                    : 
                                    <div>{this.state.voltage + " volts"}</div>
                                }
                            </div>

                            {/* <div>{this.state.machineId}</div>

                            { <div>
                                {this.state.voltage + " volts"}
                            </div> } */}

                            <div>
                                <Button onClick={() => alert("clicked")}>Click this button</Button>
                            </div>
                        </div>
                    </Flex.Item>
                    <Flex.Item styles={{
                        padding: ".8rem 0 .8rem .5rem"
                    }}>
                        <Text size="smaller" content="(C) Copyright Contextere" />
                    </Flex.Item>
                </Flex>
            </Provider>
        );
    }
}
