/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Log } from "@microsoft/sp-core-library";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http"; // Import SPHttpClient and SPHttpClientResponse from @microsoft/sp-http
import * as strings from "NavHeaderApplicationCustomizerStrings";

const LOG_SOURCE: string = "NavHeaderApplicationCustomizer";

export interface IListItem {
  HeaderDisplayName: string;
  URL: string;
}

export interface INavHeaderApplicationCustomizerProperties {
  testMessage: string;
  Top: string;
}

export default class NavHeaderApplicationCustomizer extends BaseApplicationCustomizer<INavHeaderApplicationCustomizerProperties> {
  private _headerData: IListItem[] = [];

  protected onInit(): Promise<void> {
    this._loadHeaderData();
    return Promise.resolve();
  }

  private _loadHeaderData(): void {
    const listName = "HeaderNav";
    this.context.spHttpClient
      .get(
        `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items?$select=HeaderDisplayName,URL`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => response.json())
      .then((data: any) => {
        this._headerData = data.value;
        this._renderPlaceholders();
      })
      .catch((error: any) => {
        Log.error(LOG_SOURCE, error);
      });
  }

  private _renderPlaceholders(): void {
    const topPlaceholder = this.context.placeholderProvider.tryCreateContent(
      PlaceholderName.Top,
      { onDispose: this._onDispose }
    );

    if (!topPlaceholder) {
      console.error("The expected placeholder (Top) was not found.");
      return;
    }

    const headerHTML = this._generateHeaderHTML();
    topPlaceholder.domElement.innerHTML = headerHTML;
  }

  private _generateHeaderHTML(): string {
    let headerHTML = `
      <div class="header">
        <img src="https://nhssbsnp.sharepoint.com/sites/beehive/SiteAssets/H1.png"/>
        <div class="header-right">`;

    for (const item of this._headerData) {
      headerHTML += `<a href="${item.URL}">${item.HeaderDisplayName}</a>`;
    }

    headerHTML += `
        </div>
      </div>
      <style>
        .header {
          overflow: hidden;
          background-color: #808080;
          padding: 10px 10px;
        }

        img {
          padding: 5px;
          width: 250px;
        }

        .header a {
          float: left;
          color: white;
          text-align: center;
          padding: 12px;
          text-decoration: none;
          font-size: 20px;
          line-height: 25px;
          border-radius: 4px;
        }

        .header a.logo {
          line-height: 25px;
          display: flex;
          align-items: center;
        }

        .header-right a:hover {
          background-color: #ddd;
          color: black;
        }

        .header a.active {
          background-color: dodgerblue;
          color: white;
        }

        .header-right {
          float: right;
          margin: -5px;
        }

        @media screen and (max-width: 500px) {
          .header a {
            float: none;
            display: block;
            text-align: left;
          }
        }
      </style>
    `;

    return headerHTML;
  }

  private _onDispose(): void {
    // Cleanup code
  }
}
