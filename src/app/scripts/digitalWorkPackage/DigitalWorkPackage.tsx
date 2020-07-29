import * as React from "react";
import { Provider, Flex, Text, Header, Card, CardHeader, Avatar, CardBody, Loader, Divider, Grid, Segment } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import "../styles/styles.css";
import { VictoryChart, VictoryScatter, VictoryTheme, VictoryPie, VictoryAnimation, VictoryLabel } from "victory";
import { IChatTabState } from "../chatTab/ChatTab";


export interface IDigitalWorkPackageState extends ITeamsBaseComponentState {
    // history: IChatTabState[]
    entityId?: string;
    loading: boolean;
    machineId: GUID;
    time: Date;
    voltage: number;
    temperature: number;
    light: number;
    intervalId?
}

type GUID = string & { isGuid: true};
function guid(guid: string) : GUID {
    return  guid as GUID; // maybe add validation that the parameter is an actual guid ?
}


/**
 * Properties for the NewTabTab React component
 */
export interface IDigitalWorkPackageProps {

}

/**
 * Implementation of the New content page
 */
export class DigitalWorkPackage extends TeamsBaseComponent<IDigitalWorkPackageProps, IDigitalWorkPackageState> {


    public async componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));


        if (await this.inTeams()) {
            microsoftTeams.initialize();
            microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
            microsoftTeams.getContext((context) => {
                microsoftTeams.appInitialization.notifySuccess();
                this.setState({
                    entityId: "test"
                });
                this.updateTheme(context.theme);
            });
        } else {
            this.setState({
                entityId: "This is not hosted in Microsoft Teams"
            });
        }

    }

    // public async componentDidMount() {
    //     const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/historical";
    //     const proxy = "https://cors-anywhere.herokuapp.com/";
    //     const response = await fetch(proxy + url);
    //     const data = await response.json();
    //     this.setState({history:data});
    // }


    public async componentDidMount() {
        const intervalId = setInterval(() => this.loadData(), 10000);
        this.loadData(); // Load one immediately
    }

    public async componentWillUnmount() {
        clearInterval();
    }

    public async loadData() {
        const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/";
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const response = await fetch(proxy + url);
        const data = await response.json();
        this.setState({
            machineId: data.machineId,
            time: data.time, // Timestamp format: ISO 8601
            voltage: data.voltage,
            temperature: data.temperature,
            light: data.light,
            loading: false,
        });
    }


    public render() {
        const humanTime = new Date(this.state.time);
        
        const sensordata =
            [
                { x: 1, y: 2 },
                { x: 2, y: 3 },
                { x: 3, y: 5 },
                { x: 4, y: 4 },
                { x: 5, y: 7 }
            ]

        return (
        <Provider theme={this.state.theme}>
            {/* https://fluentsite.z22.web.core.windows.net/layout */}
            <Grid styles={{
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
                msGridColumns: 'repeat(6, 1fr)',
                msGridRows: 'repeat(4, 1fr)'
            }}>

                {/*::: Temperature Card :::*/}
                <Card>
                    <CardHeader>
                        <Flex gap="gap.small">
                            <Flex column>
                                <Text size="medium" weight="bold" content="Current internal temperature" /> 
                                <br/>
                                {this.state.loading || !this.state.time ? 
                                    <Text disabled size="small" content="Fetching timestamp..." />
                                    : 
                                    <Text timestamp content={humanTime.toLocaleTimeString()} />
                                }
                                <Divider />
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        {this.state.loading || !this.state.temperature ? 
                            <Loader label="Fetching temperature data..."/> 
                            : 
                            <div>
                                <Text align="center" size="larger" weight="semibold" content={this.state.temperature + "\u00B0"+"C"} />
                                <VictoryPie
                                    data={[
                                        {x: " ", y: this.state.temperature },
                                        {x: " ", y: (Math.floor(100 - this.state.temperature))}
                                    ]} 
                                    colorScale={["tomato", "white"]}
                                    innerRadius={68} labelRadius={100}
                                    cornerRadius={({ datum }) => datum.y = 5}
                                />
                            </div>
                        }
                    </CardBody>
                </Card> 
                

                {/* <div>
                    {this.state.history.map((sensor, index) => (
                    <div key={index}>{sensor.voltage}</div>))}
                </div>                 */}

            </Grid>
        </Provider>
        );
    }// end render

}