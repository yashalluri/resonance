#!/usr/bin/env python3
"""
Dex MCP Server - Model Context Protocol server for browser automation.

This server provides tools to interact with a browser extension via WebSocket,
allowing AI models to perform browser actions like getting tabs, taking screenshots,
and navigating to URLs.
"""

import asyncio
import logging
import signal
import sys
from typing import Any, Dict

from mcp.server.fastmcp import FastMCP

from context import Context
from ws_server import start_websocket_server
from tools.browser import (
    get_tabs_tool, 
    screenshot_tool, 
    navigate_tool,
    select_tab_tool,
    new_tab_tool,
    close_tab_tool,
    search_google_tool,
    click_element_tool,
    input_text_tool,
    send_keys_tool,
    grab_dom_tool,
    capture_with_highlights_tool,
    add_assistant_message_tool
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastMCP server and context
mcp = FastMCP("dex-browser")
context = Context()
ws_server = None


@mcp.tool()
async def get_tabs() -> str:
    """Get all open browser tabs."""
    return await get_tabs_tool(context)


@mcp.tool()
async def screenshot() -> str:
    """Take a screenshot of the active tab."""
    return await screenshot_tool(context)


@mcp.tool()
async def navigate(url: str) -> str:
    """Navigate to a URL in active tab or specified tab."""
    return await navigate_tool(context, {"url": url})


@mcp.tool()
async def navigate_tab(url: str, tab_id: int) -> str:
    """Navigate to a URL in a specific tab."""
    return await navigate_tool(context, {"url": url, "tab_id": tab_id})


@mcp.tool()
async def select_tab(tab_id: int) -> str:
    """Switch to a specific browser tab by ID."""
    return await select_tab_tool(context, {"tab_id": tab_id})


@mcp.tool()
async def new_tab(url: str = None) -> str:
    """Create a new browser tab, optionally with a specific URL."""
    params = {}
    if url:
        params["url"] = url
    return await new_tab_tool(context, params)


@mcp.tool()
async def close_tab(tab_id: int = None) -> str:
    """Close a browser tab by ID, or close the active tab if no ID specified."""
    params = {}
    if tab_id is not None:
        params["tab_id"] = tab_id
    return await close_tab_tool(context, params)


@mcp.tool()
async def search_google(query: str, tab_id: int = None) -> str:
    """Perform a Google search in active tab or specified tab."""
    params = {"query": query}
    if tab_id is not None:
        params["tab_id"] = tab_id
    return await search_google_tool(context, params)


@mcp.tool()
async def click_element(element_id: str, tab_id: int = None) -> str:
    """Click on a DOM element by its ID."""
    params = {"element_id": element_id}
    if tab_id is not None:
        params["tab_id"] = tab_id
    return await click_element_tool(context, params)


@mcp.tool()
async def input_text(element_id: str, text: str, tab_id: int = None) -> str:
    """Type text into a DOM element by its ID."""
    params = {"element_id": element_id, "text": text}
    if tab_id is not None:
        params["tab_id"] = tab_id
    return await input_text_tool(context, params)


@mcp.tool()
async def send_keys(keys: str, tab_id: int = None) -> str:
    """Send keyboard shortcuts or key combinations to the page."""
    params = {"keys": keys}
    if tab_id is not None:
        params["tab_id"] = tab_id
    return await send_keys_tool(context, params)


@mcp.tool()
async def grab_dom(tab_id: int = None) -> str:
    """Get formatted DOM structure with XPath mappings for elements."""
    params = {}
    if tab_id is not None:
        params["tab_id"] = tab_id
    return await grab_dom_tool(context, params)


@mcp.tool()
async def capture_with_highlights(tab_id: int = None) -> str:
    """Take a screenshot with element highlights for better AI understanding."""
    params = {}
    if tab_id is not None:
        params["tab_id"] = tab_id
    return await capture_with_highlights_tool(context, params)

@mcp.tool()
async def add_assistant_message(message: str) -> str:
    """Manually add a message from the assistant to the chat."""
    return await add_assistant_message_tool(context, {"message": message})


async def start_background_services():
    """Start background services like WebSocket server."""
    global ws_server
    try:
        logger.info("Starting Dex MCP Server...")
        ws_server = await start_websocket_server(context)
        logger.info("WebSocket server started successfully")
    except Exception as e:
        logger.error(f"Failed to start WebSocket server: {e}")
        raise


async def cleanup():
    """Clean up resources."""
    global ws_server
    logger.info("Shutting down servers...")
    
    # Close WebSocket connections
    await context.close()
    
    # Close WebSocket server
    if ws_server:
        ws_server.close()
        await ws_server.wait_closed()
    
    logger.info("Shutdown complete")


# Set up signal handlers for graceful shutdown
def setup_signal_handlers():
    def signal_handler(signum, frame):
        logger.info("Received shutdown signal")
        asyncio.create_task(cleanup())
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)


if __name__ == "__main__":
    # Set up signal handlers
    setup_signal_handlers()
    
    # Start background services before running MCP server
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Start WebSocket server on the newly-created loop
        loop.run_until_complete(start_background_services())

        # ---- Run MCP server in a background thread ----------------------
        import threading

        def run_mcp():
            try:
                logger.info("Starting MCP server with SSE transport…")
                mcp.run(transport="sse")
            except Exception as e:
                logger.error(f"MCP server stopped: {e}")

        mcp_thread = threading.Thread(target=run_mcp, daemon=True)
        mcp_thread.start()

        # ---- Keep the asyncio loop alive for the WebSocket server ------
        loop.run_forever()

    except KeyboardInterrupt:
        logger.info("Interrupted by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}")
    finally:
        # Clean up
        try:
            loop.run_until_complete(cleanup())
        except Exception:
            pass
        loop.stop()
        loop.close()

