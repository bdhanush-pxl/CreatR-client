import React, { useState } from 'react'
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Settings, Save, Send, Calendar, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";



const PostEditorHeader = ({ mode, initialData, isPublishing, onSave, onPublish, onSchedule, onSettingsOpen, onBack }) => {

    const [isPublishMenuOpen, setIsPublishMenuOpen] = useState(false);
    const isDraft = initialData?.status === "draft";
    const isEdit = mode === "edit";

    return (
        <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-40">
            <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
                {/* Left */}
                <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="text-slate-400 hover:text-white text-xs sm:text-sm px-2 sm:px-3"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline ml-1">Back</span>
                    </Button>

                    {isDraft && (
                        <Badge
                            variant="secondary"
                            className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs"
                        >
                            Draft
                        </Badge>
                    )}
                </div>

                {/* Right */}
                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onSettingsOpen}
                        className="text-slate-400 hover:text-white p-1.5 sm:p-2"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>

                    {!isEdit && (
                        <Button
                            onClick={onSave}
                            disabled={isPublishing}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white p-1.5 sm:p-2"
                        >
                            {isPublishing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                        </Button>
                    )}

                    {isEdit ? (
                        <Button
                            variant={"primary"}
                            disabled={isPublishing}
                            onClick={() => {
                                onPublish();
                                setIsPublishMenuOpen(false);
                            }}
                            size="sm"
                            className="text-xs sm:text-sm px-2 sm:px-4"
                        >
                            {isPublishing ? (
                                <Loader2 className="h-4 w-4 mr-1 sm:mr-2 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4 mr-1 sm:mr-2" />
                            )}
                            <span className="hidden sm:inline">Update</span>
                            <span className="sm:hidden">✓</span>
                        </Button>
                    ) : (
                        <DropdownMenu
                            open={isPublishMenuOpen}
                            onOpenChange={setIsPublishMenuOpen}
                        >
                            <DropdownMenuTrigger asChild>
                                <Button variant={"primary"} disabled={isPublishing} size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                                    {isPublishing ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4 mr-1 sm:mr-2" />
                                    )}
                                    <span className="hidden sm:inline">Publish</span>
                                    <span className="sm:hidden">▼</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 sm:w-48 bg-black border-slate-700 text-sm">
                                <DropdownMenuItem
                                    onClick={() => {
                                        onPublish();
                                        setIsPublishMenuOpen(false);
                                    }}
                                    className="hover:bg-slate-800 text-xs sm:text-sm  cursor-pointer"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Publish now
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        onSchedule();
                                        setIsPublishMenuOpen(false);
                                    }}
                                    className="hover:bg-slate-800 cursor-pointer text-xs sm:text-sm"
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule for later
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    )
}

export default PostEditorHeader
