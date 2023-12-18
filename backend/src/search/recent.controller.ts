import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { RecentService } from "./recent.service";
import { recentDto } from "./dto/recent";

@Controller('/search')
export class RecentController {
    constructor(private readonly recentservice: RecentService) { }
    @Get('/recent/:userid')
    async getRecentSearch(@Param('userid') userid: string) {
        try {

            return await this.recentservice.getRecentSearch(userid)
        } catch (error) {
        }
    }
    @Post('/recent/:userid')
    async addUserToRecentSearch(@Body() body: recentDto, @Param('userid') userid: string) {
        try {

            return await this.recentservice.addUserToRecentSearch(body, userid)
        } catch (error) {

        }
    }
    @Delete('/recent/:userid')
    async deleteRecentSearch(@Param('userid') userid: string) {
        console.log('userid0:', userid)
        try {
            await this.recentservice.deleteRecentSearch(userid)
        } catch (error) {


        }
    }
    // @Delete('/recent/:userid/:oneid')
    // async deleteOneFromRecentSearch(@Param('userid') userid: string) {
    //     console.log('userid:', userid)
    //     try {
    //         await this.recentservice.deleteRecentSearch(userid)
    //     } catch (error) {

    //     }
    // }
    @Delete('/recent/:userid/:oneid')
    async deleteOneFromRecentSearch(@Param('userid') userid: string, @Param('oneid') oneid: string) {
        console.log('oneid', oneid)
        console.log('userid', userid)
        try {
            await this.recentservice.deleteOneFromRecentSearch(userid, oneid)
        } catch (error) {

        }
    }
}
