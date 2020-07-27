import * as React from "react";
import { Provider, Flex, Text, Header, Card, CardHeader, Avatar, CardBody, Loader, Divider, Grid, Segment } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import "../styles/styles.css";
import data from "../data/sampleData.js";
import { VictoryChart, VictoryScatter, VictoryTheme } from "victory";



export interface IDigitalWorkPackageState extends Array<ITeamsBaseComponentState> {
    entityId?: string;
    loading: boolean;

}

//export interface IChatTabStates extends Array<IChatTabState> {}


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

        public async componentDidMount() {
        const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/historical";
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const response = await fetch(proxy + url);
        const data = await response.json();
        this.setState({sensor: data});
    }

    // public async componentDidMount() {
    //     const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/historical";
    //     const proxy = "https://cors-anywhere.herokuapp.com/";
    //     const response = await fetch(proxy + url);
    //     const data = await response.json();
    //     this.setState({
    //         machineId: data.machineId,
    //         time: data.time, // Timestamp format: ISO 8601
    //         voltage: data.voltage,
    //         temperature: data.temperature,
    //         light: data.light,
    //         loading: false,
    //         sensors: data
    //     });
    // }

    //  const list = await response.json();
 
    // this.setState({ list });
    // };


    public render() {
        return (
        <Provider theme={this.state.theme}>
            {/* https://fluentsite.z22.web.core.windows.net/layout */}
            <Grid styles={{
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
                msGridColumns: 'repeat(6, 1fr)',
                msGridRows: 'repeat(4, 1fr)'
            }}>

                <Card className="cardy">
                    <CardHeader>
                        <Flex gap="gap.small">
                            <Avatar
                                image="../assets/agent_avatar.png"
                                label="Intelligent Agent"
                                name="Contextere"
                                status="success"
                            />
                            <Flex column>
                                <Text content="Contextere" weight="bold" />
                                <Text content="Intelligent Agent" size="small" />
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Text size="medium" weight="bold" content="Current voltage" />
                    </CardBody>
                </Card>                

            </Grid>
            <VictoryChart
                theme={VictoryTheme.material}
                domain={{ x: [0, 5], y: [0, 7] }}
                >
                <VictoryScatter
                    style={{ data: { fill: "#c43a31" } }}
                    size={8}
                    data={data}
                />
                </VictoryChart>
        </Provider>
        );
    }// end render

}