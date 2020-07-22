import * as React from "react";
import { Provider, Flex, Text, Header, Card, CardHeader, Avatar, CardBody, Loader, Divider } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export interface IDigitalWorkPackageState extends ITeamsBaseComponentState {
    entityId?: string;
    loading: boolean;
    machineId: GUID;
    time: Date;
    voltage: number[];
    temperature: number;
    light: number;
    sensors
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
        this.setState({
            machineId: data.machineId,
            time: data.time, // Timestamp format: ISO 8601
            voltage: data.voltage,
            temperature: data.temperature,
            light: data.light,
            loading: false,
            sensors: data
        });
    }

    public render() {
        console.log(this.state.voltage);
        return (
        <Provider theme={this.state.theme}>
            <Flex 
                fill={true} 
                column 
                gap="gap.small"
                styles={{
                    padding: ".8rem 0 .8rem .5rem"}}>
                <Flex.Item>
                    <Header content="This is the DigitalWorkPackage tab" />
                </Flex.Item>

                <Flex.Item>
                    <div>
                        <Text content={this.state.entityId} />
                    </div>
                </Flex.Item>
                <Flex.Item>
                    <Card>
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
                            {this.state.loading || !this.state.voltage ? 
                                <Loader label="Fetching voltage data..."/> 
                                : 
                                <div>
                                    <Text size="medium" weight="bold" content="Current voltage" /> 
                                    <br/>
                                    <Divider />
                                    <Text size="larger" weight="semibold" content={this.state.voltage + " volts"} />
                                </div>
                            }
                        </CardBody>
                    </Card>
                        </Flex.Item>

            </Flex>
        </Provider>
        );
    }// end render

}